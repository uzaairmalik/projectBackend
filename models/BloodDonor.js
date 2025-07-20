const mongoose = require('mongoose');

const BloodDonorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  location: {
    type: String,
    required: true
  },
  lastDonation: {
    type: Date,
    default: Date.now
  },
  nextDonationDate: {
    type: Date,
    default: () => new Date(Date.now() + 56 * 24 * 60 * 60 * 1000) // 56 days from now
  },
  contactNumber: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  healthConditions: [String],
  donationHistory: [{
    date: Date,
    location: String,
    volume: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
BloodDonorSchema.index({ bloodType: 1, location: 1, isAvailable: 1 });

module.exports = mongoose.model('BloodDonor', BloodDonorSchema);