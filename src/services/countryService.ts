import { api } from './api';
import { CountriesResponse } from '@/types';

export const countryService = {
  // Get countries list
  getCountries: async (): Promise<CountriesResponse> => {
    try {
      const response = await api.get<CountriesResponse>('/countries');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

