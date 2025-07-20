require('dotenv').config();
const mongoose = require('mongoose');

console.log('Environment Variables Loaded:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'Exists' : 'MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? 'Exists' : 'MISSING'
});

const testConnection = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('\nConnection String:', process.env.MONGODB_URI.slice(0, 30) + '...'); // Show first 30 chars

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });

    console.log('\n--- Connection Successful ---');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Port: ${conn.connection.port}`);
    console.log(`Database: ${conn.connection.name}`);

    // Test document operations
    const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
    await Test.create({ name: 'connection-test' });
    const count = await Test.countDocuments();
    console.log(`Test documents: ${count}`);
    await Test.deleteMany({});

    process.exit(0);
  } catch (err) {
    console.error('\n--- Connection Failed ---');
    console.error('Error:', err.name);
    console.error('Message:', err.message);
    
    if (err.message.includes('ENOTFOUND')) {
      console.error('Network Issue: Could not resolve hostname');
    } else if (err.message.includes('timed out')) {
      console.error('Timeout: Check your network connection or increase timeout');
    } else if (err.message.includes('auth failed')) {
      console.error('Authentication: Verify username/password in connection string');
    }
    
    process.exit(1);
  }
};

testConnection();