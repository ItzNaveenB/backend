const BusinessForm = require('../models/formData.js');

// Define a variable to store the submitted form data temporarily.
const submittedFormData = [];

exports.renderForm = (req, res) => {
  res.render('form');
};

exports.submitForm = (req, res) => {
  const {
    businessName,
    businessInfo,
    storeName,
    categories,
    productListing,
    shipmentDetails,
    gstNo,
    bankAccountDetails,
    verifyTaxDetails,
    signature,
  } = req.body;

  // Create a new instance of BusinessForm
  const businessForm = new BusinessForm({
    businessName,
    businessInfo,
    storeName,
    categories,
    productListing,
    shipmentDetails,
    gstNo,
    bankAccountDetails,
    verifyTaxDetails,
    signature,
  });

  // Save the form data to a temporary array.
  submittedFormData.push(businessForm);

  // Here, you can choose to save the form data to a database or perform other actions.
  // For now, we'll just send back the form data as a JSON response.
  res.json({ message: 'Form data submitted successfully' });
};

// Define a route to retrieve the submitted form data.
exports.getFormData = (req, res) => {
  res.json(submittedFormData);
};
