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
  updateProfile: async (data: UpdateProfileRequest | FormData): Promise<UpdateProfileResponse> => {
    try {
      let requestData: UpdateProfileRequest | FormData | (UpdateProfileRequest & { _method: string });
      const headers: Record<string, string> = {};

      if (data instanceof FormData) {
        // For FormData (image upload), add _method parameter
        data.append('_method', 'put');
        requestData = data;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // For JSON data, add _method parameter
        requestData = {
          ...data,
          _method: 'put'
        };
        headers['Content-Type'] = 'application/json';
      }
        
      const response = await api.post<UpdateProfileResponse, UpdateProfileRequest | FormData>(
        '/profile',
        requestData,
        { headers }
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

