const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'responded', 'spam'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
});

module.exports = mongoose.model('Contact', contactSchema);