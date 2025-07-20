const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const connectDB = require('./config/db');
// Add this with your other route imports
const bloodRoutes = require('./routes/blood');

// Add this with your other app.use() routes
app.use('/api/blood', bloodRoutes);
const bedApplications = require('./routes/bedapplications');

// Add this with your other app.use() routes
// Add this with other route imports
const contactRoutes = require('./routes/contact');

// Add this with other route middleware
app.use('/api/contact', contactRoutes);
// Add these with other route imports
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

// Add these with other route middleware
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
// Connect to database
connectDB();

const app = express();
app.use('/api/bed-applications', bedApplications);
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/beds', require('./routes/beds'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/appointments', require('./routes/appointments'));

// Error handling middleware
app.use(require('./middleware/error'));

module.exports = app;