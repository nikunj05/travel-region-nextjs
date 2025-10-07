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
  getSettingsCached: async (): Promise<GetSettingsResponse> => {
    try {
      console.log(process.env.NEXT_PUBLIC_BASE_URL , "this is call");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`, {
        next: { revalidate: 3600 },
      });
      console.log(res , "this is res");
      if (!res.ok) {
        throw new Error(`Failed to fetch settings: ${res.status}`);
      }
      const data: GetSettingsResponse = await res.json();
      return data;
    } catch (error) {
      throw error as Error;
    }
  },
};


