import { api } from './api';
import { 
  ProfileResponse, 
  UpdateProfileRequest, 
  UpdateProfileResponse,
  UserSettingsResponse,
  UpdateUserSettingsRequest,
  UpdateUserSettingsResponse
} from '@/types';

export const userService = {
  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await api.get<ProfileResponse>('/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    try {
      const response = await api.put<UpdateProfileResponse, UpdateProfileRequest>(
        '/profile',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user settings
  getUserSettings: async (): Promise<UserSettingsResponse> => {
    try {
      const response = await api.get<UserSettingsResponse>('/user-settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user settings
  updateUserSettings: async (data: UpdateUserSettingsRequest): Promise<UpdateUserSettingsResponse> => {
    try {
      const response = await api.put<UpdateUserSettingsResponse, UpdateUserSettingsRequest>(
        '/user-settings',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

