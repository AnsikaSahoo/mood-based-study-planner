import api from './api';

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getWeekly: () => api.get('/analytics/weekly'),
  getMonthly: () => api.get('/analytics/monthly'),
  getMood: () => api.get('/analytics/mood'),
  getSubjects: () => api.get('/analytics/subjects'),
};
