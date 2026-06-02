const dashboardService = require("../services/dashboardServices");

exports.registerPharmacyCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Validation
    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Category name is required",
      });
    }

    const response = await dashboardService.registerPharmacyCategory(req.body);

    return res.status(201).json({
      status: true,
      message: "Pharmacy category registered successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to register pharmacy category",
      error: error.message,
    });
  }
};

exports.registerBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName || brandName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Brand name is required",
      });
    }

    const response = await dashboardService.registerBrand(req.body);

    return res.status(201).json({
      status: true,
      message: "Brand registered successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to register brand",
      error: error.message,
    });
  }
};

exports.registerTablet = async (req, res) => {
  try {
    const { tabletName } = req.body;

    if (!tabletName || tabletName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Tablet name is required",
      });
    }

    const response = await dashboardService.registerTablet(req.body);

    return res.status(201).json({
      status: true,
      message: "Tablet registered successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to register tablet",
      error: error.message,
    });
  }
};

exports.getFilters = async (req, res) => {
  try {
    const response = await dashboardService.getFilters(req.body);

    return res.status(200).json({
      status: true,
      message: "Filters fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to get filters",
      error: error.message,
    });
  }
};

exports.getTabletHistory = async (req, res) => {
  try {
    const response = await dashboardService.getTabletHistory(req.body);

    return res.status(200).json({
      status: true,
      message: "Tablet history fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to get tablet history",
      error: error.message,
    });
  }
};
