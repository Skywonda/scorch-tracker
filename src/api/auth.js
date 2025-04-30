import apiClient from './client';
import { setToken } from '@utils/storage';

const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data && response.data.access_token) {
      setToken(response.data.access_token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/users/', userData);
    return response.data;
  },

  checkAuth: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },


  logout: () => {
    // This is handled client-side by removing the token
    // We could add a server-side logout endpoint in the future
  }
};

export default authApi;