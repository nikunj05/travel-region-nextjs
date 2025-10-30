import { api } from './api';
import { GetPopularDestinationsResponse } from '@/types/destination';

export const destinationService = {
  getPopularDestinations: async (): Promise<GetPopularDestinationsResponse> => {
    try {
      const response = await api.get<GetPopularDestinationsResponse>(
        '/popular-destinations'
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


