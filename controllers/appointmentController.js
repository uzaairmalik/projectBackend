const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const User = require('../models/user');
const { sendEmail } = require('../utils/email');

// Book new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, notes } = req.body;
    const patientId = req.user.id;
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check if time slot is available
    const availableSlots = doctor.getAvailableSlots();
    if (!availableSlots.includes(time)) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }
    
    // Check for existing appointment at same time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    // Create new appointment
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      reason,
      notes
    });
    
    await appointment.save();
    
    // Populate doctor and patient details for email
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email')
      .populate('doctor', 'specialization')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      });
    
    // Send confirmation emails
    await sendAppointmentConfirmation(populatedAppointment);
    
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment', error: err.message });
  }
};

// Helper function to send appointment confirmation emails
async function sendAppointmentConfirmation(appointment) {
  const { patient, doctor } = appointment;
  
  // Email to patient
  await sendEmail({
    to: patient.email,
    subject: 'Your Appointment Confirmation',
    html: `
      <p>Dear ${patient.name},</p>
      <p>Your appointment with Dr. ${doctor.user.name} (${doctor.specialization}) has been confirmed.</p>
      <p><strong>Appointment Details:</strong></p>
      <p>Date: ${appointment.date.toDateString()}</p>
      <p>Time: ${appointment.time}</p>
      <p>Reason: ${appointment.reason}</p>
      <p>Thank you for choosing our services.</p>
    `
  });
  
  // Email to doctor (if doctor has email)
  if (doctor.user.email) {
    await sendEmail({
      to: doctor.user.email,
      subject: 'New Appointment Booking',
      html: `
        <p>You have a new appointment booking:</p>
        <p><strong>Patient:</strong> ${patient.name}</p>
        <p><strong>Date:</strong> ${appointment.date.toDateString()}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Reason:</strong> ${appointment.reason}</p>
        ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      `
    });
  }
}

// Get appointments for user
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    const filter = {
      $or: [{ patient: userId }, { doctor: userId }]
    };
    
    if (status) {
      filter.status = status;
    }
    
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ date: 1, time: 1 });
      
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    const appointment = await Appointment.findById(id)
      .populate('patient', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized (either doctor or patient)
    if (
      appointment.doctor.user._id.toString() !== userId && 
      appointment.patient._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    // Send status update email
    await sendAppointmentStatusUpdate(appointment);
    
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment', error: err.message });
  }
};

// Helper function to send status update emails
async function sendAppointmentStatusUpdate(appointment) {
  const { patient, doctor } = appointment;
  
  // Email to patient
  await sendEmail({
    to: patient.email,
    subject: `Appointment ${appointment.status}`,
    html: `
      <p>Dear ${patient.name},</p>
      <p>Your appointment with Dr. ${doctor.user.name} has been ${appointment.status}.</p>
      <p><strong>Details:</strong></p>
      <p>Date: ${appointment.date.toDateString()}</p>
      <p>Time: ${appointment.time}</p>
      <p>Status: ${appointment.status}</p>
    `
  });
  
  // Email to doctor
  if (doctor.user.email) {
    await sendEmail({
      to: doctor.user.email,
      subject: `Appointment ${appointment.status}`,
      html: `
        <p>Your appointment with ${patient.name} has been marked as ${appointment.status}.</p>
        <p><strong>Details:</strong></p>
        <p>Date: ${appointment.date.toDateString()}</p>
        <p>Time: ${appointment.time}</p>
      `
    });
  }
}