import apiClient from './client';

const progressApi = {
  completeTask: async (taskId, completionData = {}) => {
    const response = await apiClient.post(`/progress/tasks/${taskId}/complete`, completionData);
    return response.data;
  },

  getTaskCompletions: async (taskId) => {
    const response = await apiClient.get(`/progress/tasks/${taskId}/completions`);
    return response.data;
  },
  getUserCompletions: async () => {
    const response = await apiClient.get('/progress/completions');
    return response.data;
  },

  getUserStats: async () => {
    // This endpoint would need to be added to the backend
    const response = await apiClient.get('/progress/stats');
    return response.data;
  }
};

export default progressApi;