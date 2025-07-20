const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  submitApplication,
  getApplications,
  getMyApplications,
  updateStatus
} = require('../controllers/bedController');

// Public bed application submission
router.post('/', [
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('age', 'Age is required').isInt({ min: 1 }),
    check('contactNumber', 'Valid contact number is required').isMobilePhone(),
    check('address', 'Address is required').not().isEmpty(),
    check('symptoms', 'Symptoms description is required').not().isEmpty()
  ]
], submitApplication);


router.get('/test2', (req,res)=>{
res.json(res);   
});
router.get('/applications',getApplications); // ✅ GET

// Disable admin routes since you have no login
router.get('/', (req, res) => res.status(501).json({ message: 'Admin features disabled' }));
router.get('/my-applications', (req, res) => res.status(501).json({ message: 'Login required' }));
router.put('/:id/status', (req, res) => res.status(501).json({ message: 'Admin features disabled' }));

module.exports = router;