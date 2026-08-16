const mongoose = require('mongoose');
const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Start a new study session
 * @route   POST /api/session/start
 * @access  Private
 */
const startSession = async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    throw new ApiError(400, 'Task ID is required to start a session');
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid Task ID format. Must be a valid 24-character hexadecimal ID.');
  }

  const task = await Task.findOne({ _id: taskId, user: req.user._id });
  if (!task) {
    throw new ApiError(404, 'Task not found or unauthorized');
  }

  const session = await StudySession.create({
    user: req.user._id,
    task: taskId,
    startTime: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, session, 'Study session started successfully'));
};

/**
 * @desc    End an ongoing study session
 * @route   POST /api/session/end
 * @access  Private
 */
const endSession = async (req, res) => {
  const { sessionId, focusScore, completed } = req.body;

  if (!sessionId) {
    throw new ApiError(400, 'Session ID is required to end a session');
  }

  const session = await StudySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    throw new ApiError(404, 'Study session not found');
  }

  const endTime = new Date();
  const startTime = new Date(session.startTime);
  const durationInMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));

  session.endTime = endTime;
  session.duration = durationInMinutes;
  session.focusScore = focusScore !== undefined ? focusScore : session.focusScore;
  session.completed = completed !== undefined ? completed : true;
  await session.save();

  if (session.completed) {
    await Task.findByIdAndUpdate(session.task, { completed: true });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, session, 'Study session ended successfully'));
};

/**
 * @desc    Get user's study session history
 * @route   GET /api/session/history
 * @access  Private
 */
const getSessionHistory = async (req, res) => {
  const sessions = await StudySession.find({ user: req.user._id })
    .populate('task', 'title subject priority difficulty')
    .sort({ startTime: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, sessions, 'Study session history fetched successfully'));
};

module.exports = {
  startSession,
  endSession,
  getSessionHistory,
};
