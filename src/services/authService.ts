import { api } from './api';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<{ status: boolean; message: string }> => {
    try {
      const response = await api.post<{ status: boolean; message: string }>('/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};