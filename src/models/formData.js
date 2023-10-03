 
const mongoose = require('mongoose');

const BusinessFormSchema = new mongoose.Schema({
  businessName: String,
  businessInfo: String,
  storeName: String,
  categories: [String],
  productListing: String,
  shipmentDetails: String,
  gstNo: String,
  bankAccountDetails: String,
  verifyTaxDetails: String,
  signature: String,
});

module.exports = mongoose.model('BusinessForm', BusinessFormSchema);
