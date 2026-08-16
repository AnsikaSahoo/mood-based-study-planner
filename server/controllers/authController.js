const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { generateToken, sendTokenCookie, clearTokenCookie } = require('../utils/generateToken');

/**
 * Register a new user and set auth cookie.
 */
const register = async (req, res) => {
  const { name, email, password, studyGoal, preferredStudyHours } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    studyGoal,
    preferredStudyHours,
  });

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json(
    new ApiResponse(201, { user, token }, 'User registered successfully')
  );
};

/**
 * Authenticate user and set auth cookie.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  user.password = undefined;

  res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
};

/**
 * Clear auth cookie on logout.
 */
const logout = async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
};

/**
 * Get authenticated user profile.
 */
const getProfile = async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, 'Profile fetched successfully'));
};

module.exports = { register, login, logout, getProfile };
