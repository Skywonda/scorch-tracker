import apiClient from './client';

const usersApi = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },

  getLeaderboard: async () => {
    // This endpoint would need to be added to the backend
    const response = await apiClient.get('/users/leaderboard');
    return response.data;
  }
};

export default usersApi;