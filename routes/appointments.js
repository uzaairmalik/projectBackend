const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, appointmentController.bookAppointment);
router.get('/', protect, appointmentController.getUserAppointments);
router.put('/:id', protect, appointmentController.updateAppointmentStatus);

module.exports = router;