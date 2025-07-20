const mongoose = require('mongoose');

const BedApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  contactNumber: {  // Ensure this matches exactly with frontend
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  urgencyLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms description is required']
  },
  medicalHistory: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('BedApplication', BedApplicationSchema);