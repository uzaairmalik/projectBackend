const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', contactController.submitContactForm);
router.get('/', protect, admin, contactController.getAllMessages);
router.put('/:id', protect, admin, contactController.updateMessageStatus);

module.exports = router;