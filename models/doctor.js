const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualifications: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  availableDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  availableHours: { 
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  consultationFee: { type: Number, required: true },
  bio: { type: String },
  photo: { type: String },
  hospitalAffiliation: { type: String },
  hospitalLink: { type: String },
  remoteProfile: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Generate available slots
doctorSchema.methods.getAvailableSlots = function() {
  const slots = [];
  const [startHour, startMin] = this.availableHours.start.split(':').map(Number);
  const [endHour, endMin] = this.availableHours.end.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  return slots;
};

module.exports = mongoose.model('Doctor', doctorSchema);