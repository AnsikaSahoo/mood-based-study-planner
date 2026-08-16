const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { createTaskValidation, updateTaskValidation } = require('../validations/taskValidation');
const validate = require('../validations/validate');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');

const router = express.Router();

router.use(protect);

router.get('/', AsyncHandler(getTasks));
router.post('/', createTaskValidation, validate, AsyncHandler(createTask));
router.put('/:id', updateTaskValidation, validate, AsyncHandler(updateTask));
router.delete('/:id', AsyncHandler(deleteTask));

module.exports = router;
