const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('studyGoal').optional().trim().isString().withMessage('Study goal must be a string'),
  body('preferredStudyHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Preferred study hours must be between 0 and 24'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
