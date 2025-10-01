const dashboardRepository = require('../repository/dashboardRepository');

exports.getUserDashboard = async (body) => {
  return await dashboardRepository.getUserDashboard(body);
};

exports.getUserMedicationAndRemainder = async (body) => {
  return await dashboardRepository.getUserMedicationAndRemainder(body);
};

exports.registerPharmacyCategory = async (body) => {
  const { categoryName } = body;

  if (!categoryName || categoryName.trim() === "") {
    throw new Error("Category name is required");  // ❌ throw error here
  }

  return await dashboardRepository.registerPharmacyCategory(body);
};
