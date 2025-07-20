const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token;
  
  try {
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized' 
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized` 
      });
    }
    next();
  };
};