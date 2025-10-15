import { api } from './api';
import { 
  GetHotelsRequest, 
  GetHotelsResponse, 
  GetHotelDetailsRequest, 
  GetHotelDetailsResponse 
} from '@/types/hotel';

export const hotelService = {
  getHotels: async (payload: GetHotelsRequest): Promise<GetHotelsResponse> => {
    try {
      const response = await api.post<GetHotelsResponse, GetHotelsRequest>(`/hotels`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getHotelDetails: async (payload: GetHotelDetailsRequest): Promise<GetHotelDetailsResponse> => {
    try {
      const { hotelId, language = 'ENG' } = payload;
      const response = await api.get<GetHotelDetailsResponse>(
        `/hotels/${hotelId}/details?language=${language}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


