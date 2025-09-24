import { api } from './api';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, ResetPasswordRequest, ResetPasswordResponse } from '@/types';

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

  forgotPassword: async (
    data: { email: string }
  ): Promise<{ status: boolean; message: string }> => {
    try {
      const response = await api.post<{ status: boolean; message: string }>(
        '/password/forgot-password',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await api.post<ResetPasswordResponse, ResetPasswordRequest>(
        '/password/reset-password',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Social login: exchanges social identity for backend token
  socialAuth: async (
    data: {
      first_name: string;
      last_name: string;
      email: string;
      social_media_id: string;
    }
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse, typeof data>(
        '/social-auth',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};