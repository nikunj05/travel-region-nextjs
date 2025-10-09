import { api } from './api';
import { GetSettingsResponse } from '@/types/settings';

export const settingsService = {
  getSettings: async (): Promise<GetSettingsResponse> => {
    try {
      const response = await api.get<GetSettingsResponse>('/settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Uses Next.js fetch caching with hourly revalidation (server-only)
  // Pass locale from server component to add Accept-Language header
  getSettingsCached: async (locale: string = 'en'): Promise<GetSettingsResponse> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale, // Add locale header that API expects
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Failed to fetch settings: ${res.status}`, errorText);
        throw new Error(`Failed to fetch settings: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Settings API Response:', JSON.stringify(data, null, 2));
      
      // Handle different response structures
      // If data has the expected structure, return it
      if (data && typeof data === 'object' && 'data' in data && data.data && 'setting' in data.data) {
        return data as GetSettingsResponse;
      }
      
      // If data.setting exists directly (without nested data property)
      if (data && typeof data === 'object' && 'setting' in data) {
        return {
          status: true,
          message: 'Success',
          data: {
            setting: data.setting
          }
        } as GetSettingsResponse;
      }
      
      // If the response is the setting object directly
      if (data && typeof data === 'object' && ('logo' in data || 'favicon' in data)) {
        return {
          status: true,
          message: 'Success',
          data: {
            setting: data
          }
        } as GetSettingsResponse;
      }
      
      // If we can't determine the structure, throw an error
      console.error('Unexpected settings API response structure:', data);
      throw new Error('Invalid settings response structure');
    } catch (error) {
      console.error('Error in getSettingsCached:', error);
      throw error as Error;
    }
  },
};


