import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/notificationAPI';
import NotificationPanel from '../components/NotificationPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getNotifications();
      setNotifications(res.data || res || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div class="space-y-8 max-w-4xl">
      <div>
        <h1 class="font-display font-bold text-2xl sm:text-3xl text-slate-100">Notifications & Alerts</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Stay on top of upcoming task deadlines, daily mood check-ins, and study schedule alerts.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching notification panel..." />
      ) : (
        <NotificationPanel
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
