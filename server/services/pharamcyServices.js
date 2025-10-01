const pharmacyRepository = require('../repository/pharmacyRepository');

exports.registerPharmacyCategory = async (body) => {
  return await pharmacyRepository.registerPharmacyCategory(body);
};

exports.registerBrand = async (body) => {
  return await pharmacyRepository.registerBrand(body);
};
exports.registerTablet = async (body) => {
  
  return await pharmacyRepository.registerTablet(body);
};

exports.getFilters = async (body) => {
  return await pharmacyRepository.getFilters(body);
};
exports.getTabletHistory = async (body) => {
  return await pharmacyRepository.getTabletHistory(body);
};
