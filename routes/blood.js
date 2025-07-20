const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bloodController = require('../controllers/bloodController');
const auth = require('../middleware/auth');

// @route   POST /api/blood/donors
// @desc    Register as blood donor
// @access  Private
router.post('/donors', [
  auth,
  [
    check('bloodType', 'Blood type is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('contactNumber', 'Contact number is required').not().isEmpty()
  ]
], bloodController.registerDonor);

// @route   GET /api/blood/donors
// @desc    Get blood donors
// @access  Public
router.get('/donors', bloodController.getDonors);

// @route   GET /api/blood/compatibility
// @desc    Get blood type compatibility info
// @access  Public
router.get('/compatibility', bloodController.getCompatibilityInfo);

// @route   GET /api/blood/process
// @desc    Get blood donation process info
// @access  Public
router.get('/process', bloodController.getDonationProcess);

module.exports = router;