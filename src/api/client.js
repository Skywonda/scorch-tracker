import axios from 'axios';
import { getToken, removeToken } from '@utils/storage';

const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/api/v1';
  }

  return import.meta.env.VITE_API_URL ||
    (window.location.protocol + '//' + window.location.host + '/api/v1');
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
    }
    setTimeout(() => {
    }, 5000);
    return Promise.reject(error);
  }
);

export default apiClient;