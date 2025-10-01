const dashboardService = require('../services/dashboardServices');

exports.getUserDashboard = async (req, res) => {
  try {
    const response = await dashboardService.getUserDashboard(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

exports.getUserMedicationAndRemainder = async (req, res) => {
  try {
    const response = await dashboardService.getUserMedicationAndRemainder(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

exports.registerPharmacyCategory = async (req, res) => {
  try {
    const response = await dashboardService.registerPharmacyCategory(req.body);
    res.status(201).json({
      status: true,
      message: "Pharmacy category registered successfully",
      data: response
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};





