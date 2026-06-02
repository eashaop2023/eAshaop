const Category = require('../models/categoryModel');
const Doctor = require('../models/doctorModel');

// Helper function to create flexible matching patterns for category names
// This ensures doctors are matched to their categories even if there are naming variations
const createSpecialityMatcher = (categoryName) => {
  const trimmed = categoryName.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const conditions = [];
  const lowerName = trimmed.toLowerCase();
  
  // Handle specific categories first to avoid cross-matching
  // Neurologist - must start with "neuro" to avoid matching "Urologist"
  if (lowerName === 'neurologist' || lowerName.startsWith('neuro')) {
    conditions.push({ speciality: { $regex: /^neuro/i } });
    return { $or: conditions };
  }
  
  // Urologist - must start with "urolog" (not "neuro")
  if (lowerName === 'urologist' || lowerName.startsWith('urolog')) {
    conditions.push({ speciality: { $regex: /^urolog/i } });
    return { $or: conditions };
  }
  
  // Physiotherapist variations
  if (lowerName.includes('physio')) {
    conditions.push({ speciality: { $regex: /^physio/i } });
    conditions.push({ speciality: { $regex: /^physical\s+therapy/i } });
    return { $or: conditions };
  }
  
  // Gynecologist variations (including British spelling)
  if (lowerName.includes('gynecol') || lowerName.includes('gynaecol')) {
    conditions.push({ speciality: { $regex: /^gyn(ae|e)col/i } });
    conditions.push({ speciality: { $regex: /^women\s+health/i } });
    return { $or: conditions };
  }
  
  // Psychiatrist variations
  if (lowerName.includes('psychiatr')) {
    conditions.push({ speciality: { $regex: /^psychiatr/i } });
    conditions.push({ speciality: { $regex: /^mental\s+health/i } });
    return { $or: conditions };
  }
  
  // Pediatrician variations
  if (lowerName.includes('pediatric')) {
    conditions.push({ speciality: { $regex: /^pediatric/i } });
    conditions.push({ speciality: { $regex: /^paediatric/i } }); // British spelling
    conditions.push({ speciality: { $regex: /^child\s+health/i } });
    return { $or: conditions };
  }
  
  // For all other categories, use standard matching
  // 1. Exact match (case-insensitive) - primary match
  conditions.push({ speciality: { $regex: new RegExp(`^${escaped}$`, "i") } });
  
  // 2. Remove "specialist" suffix and match
  // Example: "ENT Specialist" category matches doctors with speciality "ENT"
  const withoutSpecialist = trimmed.replace(/\s*specialist\s*$/i, "").trim();
  if (withoutSpecialist && withoutSpecialist !== trimmed) {
    const escapedWithout = withoutSpecialist.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    conditions.push({ speciality: { $regex: new RegExp(`^${escapedWithout}$`, "i") } });
  }
  
  // 3. Add "specialist" suffix and match
  // Example: "ENT" category matches doctors with speciality "ENT Specialist"
  if (!trimmed.toLowerCase().includes("specialist")) {
    conditions.push({ speciality: { $regex: new RegExp(`^${escaped}\\s*specialist$`, "i") } });
  }
  
  // Return $or condition for MongoDB query
  return { $or: conditions };
};

// @desc    Create or update category (with doctor if provided)
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, doctorId } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findOneAndUpdate(
      { name: name.trim() },
      doctorId ? { $addToSet: { doctors: doctorId } } : {}, 
      { new: true, upsert: true } 
    );

    res.status(200).json({
      message: doctorId
        ? "Doctor added to category (or category created if not exists)"
        : "Category created or already exists",
      category
    });
  } catch (error) {
    console.error("Error creating/updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all categories with doctor count
// @route   GET /api/categories
const getAllCategories = async (req, res) => {
  try {
    // Ensure required categories exist
    const requiredCategories = [
      { name: "Physiotherapist", uuid: "PhyThr_01" },
      { name: "Urologist", uuid: "Urolgst_01" },
      { name: "Gynecologist", uuid: "Gynclgst_01" },
      { name: "Psychiatrist", uuid: "Psych_01" },
      { name: "Pediatrician", uuid: "Ped_01" },
      { name: "ENT Specialist", uuid: "4A31RiqS_M" },
      { name: "Dermatologist", uuid: "DrmtLgst_01" }
    ];

    for (const reqCat of requiredCategories) {
      const existing = await Category.findOne({ 
        $or: [
          { name: { $regex: new RegExp(`^${reqCat.name}$`, "i") } },
          { uuid: reqCat.uuid }
        ]
      });

      if (!existing) {
        try {
          await Category.create({
            name: reqCat.name,
            uuid: reqCat.uuid
          });
          console.log(`✅ Created missing category: ${reqCat.name}`);
        } catch (error) {
          // If category with same name but different UUID exists, update it
          const sameName = await Category.findOne({ 
            name: { $regex: new RegExp(`^${reqCat.name}$`, "i") }
          });
          if (sameName && sameName.uuid !== reqCat.uuid) {
            sameName.uuid = reqCat.uuid;
            await sameName.save();
            console.log(`✅ Updated category UUID for: ${reqCat.name}`);
          }
        }
      }
    }

    const categories = await Category.find();

    // Count doctors by specialty name for each category
    const results = await Promise.all(
      categories.map(async (cat) => {
        // Use flexible matching to find all doctors whose specialty matches the category
        const specialityMatcher = createSpecialityMatcher(cat.name);
        const doctorCount = await Doctor.countDocuments({
          ...specialityMatcher,
          isActive: true,
          isApproved: true
        });

        // Debug logging for empty categories
        if (doctorCount === 0 && ['Physiotherapist', 'Urologist', 'Gynecologist'].includes(cat.name)) {
          const sampleDoctors = await Doctor.find({ isActive: true, isApproved: true })
            .select('speciality')
            .limit(10);
          const sampleSpecialities = [...new Set(sampleDoctors.map(d => d.speciality).filter(Boolean))];
          console.log(`⚠️  ${cat.name}: No doctors found. Sample specialities in DB:`, sampleSpecialities);
        }

        return {
          uuid: cat.uuid,
          name: cat.name,
          doctorCount: doctorCount,
          message: doctorCount > 0 ? null : "Currently no doctors available"
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get doctors by category uuid
// @route   GET /api/categories/:uuid/doctors
const getDoctorsByCategoryByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find category by UUID
    const category = await Category.findOne({ uuid });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Use flexible matching to find ALL doctors whose specialty matches the category
    // This handles variations like "ENT" matching "ENT Specialist" category
    const specialityMatcher = createSpecialityMatcher(category.name);
    const query = {
      ...specialityMatcher,
      isActive: true,
      isApproved: true
    };

    const totalDoctors = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .select('-password -verificationCode -loginOTP -resetOTP -__v')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    if (!doctors || doctors.length === 0) {
      return res.json({
        category: category.name,
        totalDoctors: 0,
        page,
        limit,
        totalPages: 0,
        doctors: [],
        message: "No doctors are present in this category"
      });
    }

    // Convert to plain objects and verify speciality field
    const doctorsData = doctors.map(doc => {
      const doctorObj = doc.toObject ? doc.toObject() : doc;
      // Log if speciality is missing
      if (!doctorObj.speciality) {
        console.warn(`⚠️  Doctor ${doctorObj._id || doctorObj.name} missing speciality field`);
      }
      return doctorObj;
    });

    // Log sample doctor data for debugging
    if (doctorsData.length > 0) {
      console.log(`✅ Returning ${doctorsData.length} doctors for category ${category.name}`);
      console.log(`Sample doctor fields:`, Object.keys(doctorsData[0]));
      console.log(`Sample doctor speciality:`, doctorsData[0].speciality);
    }

    res.json({
      category: category.name,
      totalDoctors,
      page,
      limit,
      totalPages: Math.ceil(totalDoctors / limit),
      doctors: doctorsData
    });
  } catch (error) {
    console.error("Error fetching doctors by category UUID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createCategory, getAllCategories, getDoctorsByCategoryByUUID };
