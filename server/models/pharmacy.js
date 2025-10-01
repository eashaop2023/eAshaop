// models/pharmacyModel.js
const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  // Category
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
//   categoryDescription: { type: String },

  // Brand
  brandId: { type: String, required: true },
  brandName: { type: String, required: true },
  brandRegister: { type: String, required: true },

  // Tablet
  tabletId: { type: String, required: true },
  tabletName: { type: String, required: true },
//   addedBy: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  description: { type: String } // optional
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);
