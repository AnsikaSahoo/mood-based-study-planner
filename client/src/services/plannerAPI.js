import api from './api';

export const plannerAPI = {
  generatePlan: (data) => api.post('/planner/generate', data),
  getTodayPlan: () => api.get('/planner/today'),
  regeneratePlan: () => api.delete('/planner/regenerate'),
};
