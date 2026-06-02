const Pharmacy = require('../models/pharmacy');
const { v4: uuidv4 } = require('uuid');

// ======================
// 1. Register Pharmacy Category
// ======================
exports.registerPharmacyCategory = async (body) => {
  try {
    const { categoryName, categoryDescription, addedBy } = body;
    if (!categoryName || !addedBy)
      return { status: false, message: "Missing required fields" };

    const categoryId = uuidv4();
    const result = await new Pharmacy({
      categoryId,
      categoryName,
    //   categoryDescription: categoryDescription || "",

      // placeholders for brand & tablet
      brandId: null,
      brandName: null,
      brandRegister: null,
      tabletId: null,
      tabletName: null,
      description: null,
    //   addedBy
    }).save();

    return { status: true, message: "Pharmacy category registered", docs: result };
  } catch (err) {
    console.error("❌ Pharmacy category registration failed:", err.message);
    return { status: false, message: "Pharmacy category registration failed", error: err.message };
  }
};

// ======================
// 2. Register Brand
// ======================
exports.registerBrand = async (body) => {
  try {
    const { categoryId, brandName, brandRegister, addedBy } = body;
    if (!categoryId || !brandName || !brandRegister || !addedBy)
      return { status: false, message: "Missing required fields" };

    const brandId = uuidv4();
    const result = await new Pharmacy({
      categoryId,
      categoryName: "", // can fill dynamically
    //   categoryDescription: "",

      brandId,
      brandName,
      brandRegister,

      tabletId: null,
      tabletName: null,
      description: null,
    //   addedBy
    }).save();

    return { status: true, message: "Brand registered", docs: result };
  } catch (err) {
    console.error("❌ Brand registration failed:", err.message);
    return { status: false, message: "Brand registration failed", error: err.message };
  }
};

// ======================
// 3. Register Tablet
// ======================
exports.registerTablet = async (body) => {
  try {
    const { categoryId, brandId, tabletName, addedBy, description } = body;
    if (!categoryId || !brandId || !tabletName || !addedBy)
      return { status: false, message: "Missing required fields" };

    const tabletId = uuidv4();
    const result = await new Pharmacy({
      categoryId,
      categoryName: "",

      brandId,
      brandName: "",
      brandRegister: "",

      tabletId,
      tabletName,
      description: description || "",
    //   addedBy
    }).save();

    return { status: true, message: "Tablet registered", docs: result };
  } catch (err) {
    console.error("❌ Tablet registration failed:", err.message);
    return { status: false, message: "Tablet registration failed", error: err.message };
  }
};

// ======================
// 4. Get Filters (Category -> Brand -> Tablets)
// ======================
exports.getFilters = async () => {
  try {
    const data = await Pharmacy.find({});

    const filters = {};

    data.forEach(item => {
      const category = item.categoryName;
      const brand = item.brandName;
      const tablet = item.tabletName;

      if (!filters[category]) filters[category] = {};
      if (brand && !filters[category][brand]) filters[category][brand] = [];
      if (tablet && !filters[category][brand].includes(tablet))
        filters[category][brand].push(tablet);
    });

    return { status: true, message: "Filters fetched successfully", docs: filters };
  } catch (err) {
    console.error("❌ Fetch filters failed:", err.message);
    return { status: false, message: "Fetch filters failed", error: err.message };
  }
};

// ======================
// 5. Get Tablet History
// ======================
exports.getTabletHistory = async (tabletName) => {
  try {
    const tablets = await Pharmacy.find({ tabletName });
    if (!tablets.length) return { status: false, message: "No history found" };

    const history = tablets.map(t => ({
      categoryName: t.categoryName,
      brandName: t.brandName,
      brandRegister: t.brandRegister,
      tabletName: t.tabletName,
      addedBy: t.addedBy,
      addedAt: t.addedAt,
      description: t.description
    }));

    return { status: true, message: "Tablet history fetched", docs: history };
  } catch (err) {
    console.error("❌ Tablet history fetch failed:", err.message);
    return { status: false, message: "Tablet history fetch failed", error: err.message };
  }
};
