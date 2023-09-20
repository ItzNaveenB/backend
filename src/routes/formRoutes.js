const express = require('express');
const router = express.Router();
const formController = require('../controller/formController');

// Serve the HTML form
router.get('/form', formController.renderForm);

// Handle form submissions
router.post('/submit', (req, res) => { 
    formController.submitForm(req, res);
});

// Retrieve submitted form data
router.get('/getFormData', formController.getFormData);

module.exports = router;
