const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const AsyncHandler = require('../utils/AsyncHandler');

/**
 * Verify JWT from httpOnly cookie and attach user to request.
 */
const protect = AsyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in first.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'User not found. Token is invalid.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized. Invalid or expired token.');
  }
});

module.exports = { protect };
