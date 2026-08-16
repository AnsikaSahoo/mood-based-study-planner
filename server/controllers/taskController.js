const Task = require('../models/Task');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * Get all tasks for the authenticated user with optional filters.
 */
const getTasks = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.completed !== undefined) {
    filter.completed = req.query.completed === 'true';
  }

  const tasks = await Task.find(filter).sort({ deadline: 1 });

  res.status(200).json(
    new ApiResponse(200, { tasks, count: tasks.length }, 'Tasks fetched successfully')
  );
};

/**
 * Create a new task for the authenticated user.
 */
const createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { task }, 'Task created successfully'));
};

/**
 * Update an existing task owned by the user.
 */
const updateTask = async (req, res) => {
  let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, { task }, 'Task updated successfully'));
};

/**
 * Delete a task owned by the user.
 */
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json(new ApiResponse(200, { task }, 'Task deleted successfully'));
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
