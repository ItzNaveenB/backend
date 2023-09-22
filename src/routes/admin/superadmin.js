const express = require('express');
const router = express.Router();
const superadminController = require('../../controller/admin/superadminController.js');

// Route to find total users who signed up and retrieve their IDs
router.get('/totalUsers', superadminController.findTotalUsers);

// Route to retrieve user details by ID
router.get('/user/:id', superadminController.getUserDetailsById);

module.exports = router;







