import { api } from './api';
import { 
  GetNotificationPreferencesResponse, 
  UpdateNotificationPreferencesRequest, 
  UpdateNotificationPreferencesResponse 
} from '@/types/notification';

export const notificationService = {
  /**
   * Get notification preferences for the current user
   * Returns null if user hasn't set preferences yet
   */
  getNotificationPreferences: async (): Promise<GetNotificationPreferencesResponse> => {
    try {
      const response = await api.get<GetNotificationPreferencesResponse>('/notification-preferences');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update notification preferences for the current user
   * @param preferences - Partial notification preferences to update
   */
  updateNotificationPreferences: async (
    preferences: UpdateNotificationPreferencesRequest
  ): Promise<UpdateNotificationPreferencesResponse> => {
    try {
      const response = await api.put<UpdateNotificationPreferencesResponse, UpdateNotificationPreferencesRequest>(
        '/notification-preferences',
        preferences
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
