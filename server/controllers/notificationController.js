const NotificationService = require('../services/notificationService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Create a new notification
 * @route   POST /api/notifications
 * @access  Private
 */
const createNotification = async (req, res) => {
  const { title, message, type, scheduledFor } = req.body;

  if (!title || !message || !type) {
    throw new ApiError(400, 'Title, message, and type are required');
  }

  const notification = await NotificationService.createNotification(req.user._id, {
    title,
    message,
    type,
    scheduledFor,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, notification, 'Notification created successfully'));
};

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  const notifications = await NotificationService.getUserNotifications(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, 'Notifications fetched successfully'));
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  const notification = await NotificationService.markAsRead(req.params.id, req.user._id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, 'Notification marked as read'));
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  const notification = await NotificationService.deleteNotification(req.params.id, req.user._id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Notification deleted successfully'));
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
};
