const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const { sendEmail } = require('../utils/email');

// Get all doctors with filtering
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, location } = req.query;
    const filter = {};
    
    if (specialization) {
      filter.specialization = new RegExp(specialization, 'i');
    }
    
    if (location) {
      filter.location = new RegExp(location, 'i');
    }
    
    const doctors = await Doctor.find(filter)
      .populate('user', ['name', 'email', 'phone'])
      .sort({ rating: -1 });
      
    // Add available slots to each doctor
    const doctorsWithSlots = doctors.map(doctor => {
      const doctorObj = doctor.toObject();
      doctorObj.availableSlots = doctor.getAvailableSlots();
      return doctorObj;
    });
    
    res.status(200).json(doctorsWithSlots);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
};

// Get single doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', ['name', 'email', 'phone'])
      .populate('reviews.patient', 'name');
      
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const doctorObj = doctor.toObject();
    doctorObj.availableSlots = doctor.getAvailableSlots();
    
    res.status(200).json(doctorObj);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctor', error: err.message });
  }
};

// Add review to doctor
exports.addReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const doctorId = req.params.id;
    const patientId = req.user.id;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check if user already reviewed
    const existingReview = doctor.reviews.find(
      r => r.patient.toString() === patientId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this doctor' });
    }
    
    // Add review
    doctor.reviews.push({
      patient: patientId,
      review,
      rating
    });
    
    // Update average rating
    const totalRatings = doctor.reviews.reduce((sum, item) => sum + item.rating, 0);
    doctor.rating = totalRatings / doctor.reviews.length;
    
    await doctor.save();
    
    res.status(201).json(doctor.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};