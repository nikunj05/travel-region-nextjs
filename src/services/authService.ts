import { api } from './api';

export const authService = {
  login: async (data: any) => {
    try {
      const response = await api.post('/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: any) => {
    try {
      const response = await api.post('/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
