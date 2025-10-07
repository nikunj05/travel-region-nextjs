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
      // console.log(process.env.NEXT_PUBLIC_BASE_URL , "this is call");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale, // Add locale header that API expects
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      
      // console.log(res , "this is res");
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Failed to fetch settings: ${res.status}`, errorText);
        throw new Error(`Failed to fetch settings: ${res.status}`);
      }
      
      const data: GetSettingsResponse = await res.json();
      return data;
    } catch (error) {
      console.error('Error in getSettingsCached:', error);
      throw error as Error;
    }
  },
};


