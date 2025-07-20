require('dotenv').config(); // This must be at the very top
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debugging line - verify the URI is loading
    console.log('Connection URI:', process.env.MONGODB_URI ? '***URI loaded***' : 'URI NOT FOUND');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;