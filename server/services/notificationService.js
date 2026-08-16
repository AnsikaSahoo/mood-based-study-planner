const Notification = require('../models/Notification');
const Task = require('../models/Task');

/**
 * Service to handle notification logic and automatic reminder generators.
 */
class NotificationService {
  /**
   * Create a generic notification for a user.
   */
  static async createNotification(userId, { title, message, type, scheduledFor }) {
    return await Notification.create({
      user: userId,
      title,
      message,
      type,
      scheduledFor: scheduledFor || new Date(),
    });
  }

  /**
   * Generate study reminder notification.
   */
  static async createStudyReminder(userId, taskTitle, scheduledTime) {
    return await this.createNotification(userId, {
      title: '📖 Study Reminder',
      message: `Time to focus on "${taskTitle}". Get ready for your study session!`,
      type: 'study_reminder',
      scheduledFor: scheduledTime,
    });
  }

  /**
   * Generate deadline reminder notification for upcoming tasks.
   */
  static async createDeadlineReminder(userId, taskId) {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) return null;

    return await this.createNotification(userId, {
      title: '⏳ Upcoming Task Deadline',
      message: `Task "${task.title}" is due soon (${new Date(task.deadline).toLocaleDateString()}).`,
      type: 'deadline_reminder',
      scheduledFor: new Date(),
    });
  }

  /**
   * Generate planner reminder notification.
   */
  static async createPlannerReminder(userId) {
    return await this.createNotification(userId, {
      title: '📅 Daily Study Plan Ready',
      message: 'Your study schedule for today has been calculated based on your mood.',
      type: 'planner_reminder',
      scheduledFor: new Date(),
    });
  }

  /**
   * Get all notifications for a user.
   */
  static async getUserNotifications(userId) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  /**
   * Mark notification as read.
   */
  static async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }

  /**
   * Delete notification.
   */
  static async deleteNotification(notificationId, userId) {
    return await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  }
}

module.exports = NotificationService;
