const Dashboard = require('../models/dashboard');
const Pharmacy = require('../models/pharmacy'); 
const PharmacyCategory = require('../models/pharmacy'); // <-- make sure you have this model

// ======================
// 1. Dashboard API
// ======================
exports.getUserDashboard = async (body) => {
  try {
    let { phone_number } = body;
    if (!phone_number) return { status: false, message: "Missing phone_number" };

    const dashboard = await Dashboard.findOne({ phone_number });
    if (!dashboard) return { status: false, message: "No dashboard data found" };

    const dashboardStats = {
      full_name: dashboard.full_name,
      heart_rate: dashboard.heart_rate,
      blood_pressure: dashboard.blood_pressure,
      most_activities: dashboard.most_activities,
      walk: dashboard.walk,
      run: dashboard.run,
      cycling: dashboard.cycling
    };

    return {
      status: true,
      message: "Dashboard fetched successfully",
      docs: { dashboard: dashboardStats }
    };
  } catch (err) {
    console.error("❌ Dashboard fetch failed:", err.message);
    return { status: false, message: "Dashboard fetch failed", error: err.message };
  }
};

// ======================
// 2. Medication + Remainder API
// ======================
exports.getUserMedicationAndRemainder = async (body) => {
  try {
    let { phone_number } = body;
    if (!phone_number) return { status: false, message: "Missing phone_number" };

    const dashboard = await Dashboard.findOne({ phone_number });
    if (!dashboard) return { status: false, message: "No dashboard data found" };

    const pharmacyData = await Pharmacy.find({ userId: dashboard.userId });
    if (!pharmacyData || pharmacyData.length === 0)
      return { status: false, message: "No medication found in pharmacy" };

    const medication = { morning: {}, afternoon: {}, night: {} };
    pharmacyData.forEach(item => {
      const { time, tabletName, slot } = item;
      if (!medication[time]) medication[time] = {};
      medication[time][slot] = tabletName;
    });

    const medicineRemainder = {};
    ['morning','afternoon','night'].forEach(time => {
      if (medication[time]) {
        medicineRemainder[time] = Object.values(medication[time]).join(", ");
      }
    });

    return {
      status: true,
      message: "Medication & Remainder fetched successfully",
      docs: {
        medication,
        medicine: medicineRemainder
      }
    };
  } catch (err) {
    console.error("❌ Medication & Remainder fetch failed:", err.message);
    return { status: false, message: "Medication & Remainder fetch failed", error: err.message };
  }
};

// ======================
// 3. Register Pharmacy Category
// ======================
exports.registerPharmacyCategory = async (body) => {
  try {
    let { name, description } = body;
    if (!name) return { status: false, message: "Category name is required" };

    const existing = await PharmacyCategory.findOne({ name });
    if (existing) {
      return { status: false, message: "Category already exists" };
    }

    const newCategory = new PharmacyCategory({
      name,
      description
    });

    const savedCategory = await newCategory.save();

    return {
      status: true,
      message: "Pharmacy category registered successfully",
      docs: savedCategory
    };
  } catch (err) {
    console.error("❌ Register pharmacy category failed:", err.message);
    return { status: false, message: "Failed to register pharmacy category", error: err.message };
  }
};
