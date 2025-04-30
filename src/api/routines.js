import apiClient from './client';


const routinesApi = {
  getRoutines: async () => {
    const response = await apiClient.get('/routines/');
    return response.data;
  },

  getRoutine: async (routineId) => {
    const response = await apiClient.get(`/routines/${routineId}`);
    return response.data;
  },

  createRoutine: async (routineData) => {
    const response = await apiClient.post('/routines/', routineData);
    return response.data;
  },

  updateRoutine: async (routineId, routineData) => {
    const response = await apiClient.put(`/routines/${routineId}`, routineData);
    return response.data;
  },
  deleteRoutine: async (routineId) => {
    const response = await apiClient.delete(`/routines/${routineId}`);
    return response.data;
  },

  createTask: async (routineId, taskData) => {
    const response = await apiClient.post(`/routines/${routineId}/tasks`, taskData);
    return response.data;
  },

  updateTask: async (routineId, taskId, taskData) => {
    const response = await apiClient.put(`/routines/${routineId}/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (routineId, taskId) => {
    const response = await apiClient.delete(`/routines/${routineId}/tasks/${taskId}`);
    return response.data;
  }
};

export default routinesApi;