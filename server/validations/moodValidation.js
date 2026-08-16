const { body } = require('express-validator');
const { MOOD_VALUES } = require('../models/Mood');

const createMoodValidation = [
  body('mood')
    .isIn(MOOD_VALUES)
    .withMessage(`Mood must be one of: ${MOOD_VALUES.join(', ')}`),
  body('stressLevel')
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10'),
  body('energyLevel')
    .isInt({ min: 1, max: 10 })
    .withMessage('Energy level must be between 1 and 10'),
  body('sleepHours')
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
];

module.exports = { createMoodValidation };
