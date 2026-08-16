import api from './api';

export const sessionAPI = {
  startSession: (data) => api.post('/session/start', data),
  endSession: (data) => api.post('/session/end', data),
  getSessionHistory: () => api.get('/session/history'),
};
