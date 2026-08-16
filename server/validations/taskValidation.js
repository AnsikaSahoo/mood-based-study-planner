const { body } = require('express-validator');
const { PRIORITY_VALUES, DIFFICULTY_VALUES } = require('../models/Task');

const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim().isString(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`),
  body('difficulty')
    .optional()
    .isIn(DIFFICULTY_VALUES)
    .withMessage(`Difficulty must be one of: ${DIFFICULTY_VALUES.join(', ')}`),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('estimatedTime')
    .isInt({ min: 1 })
    .withMessage('Estimated time must be at least 1 minute'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];

const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().isString(),
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`),
  body('difficulty')
    .optional()
    .isIn(DIFFICULTY_VALUES)
    .withMessage(`Difficulty must be one of: ${DIFFICULTY_VALUES.join(', ')}`),
  body('deadline').optional().isISO8601().withMessage('Valid deadline date is required'),
  body('estimatedTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated time must be at least 1 minute'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];

module.exports = { createTaskValidation, updateTaskValidation };
