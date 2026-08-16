import api from './api';

export const moodAPI = {
  logMood: (data) => api.post('/moods', data),
  getTodayMood: () => api.get('/moods/today'),
  getMoodHistory: () => api.get('/moods/history'),
};
