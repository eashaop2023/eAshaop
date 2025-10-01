const Category = require('../models/categoryModel');
const Doctor = require('../models/doctorModel');

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
    const categories = await Category.find();

    const results = categories.map(cat => ({
      uuid: cat.uuid,
      name: cat.name,
      doctorCount: cat.doctors.length, 
      message: cat.doctors.length > 0 ? null : "Currently no doctors available"
    }));

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

    // Find category by UUID
    const category = await Category.findOne({ uuid }).populate("doctors");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!category.doctors || category.doctors.length === 0) {
      return res.json({
        category: category.name,
        message: "No doctors are present in this category"
      });
    }

    res.json({
      category: category.name,
      doctors: category.doctors
    });
  } catch (error) {
    console.error("Error fetching doctors by category UUID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createCategory, getAllCategories, getDoctorsByCategoryByUUID };
