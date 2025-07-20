module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: '24h',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lifelinkhealthhub',
  PORT: process.env.PORT || 5000
};