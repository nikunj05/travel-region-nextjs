import { api } from './api';
import { 
  GetHotelsRequest, 
  GetHotelsResponse, 
  GetHotelDetailsRequest, 
  GetHotelDetailsResponse,
  GetAccommodationTypesResponse,
  GetHotelLocationsRequest,
  GetHotelLocationsResponse,
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
      const { hotelId, ...body } = payload;
      const response = await api.post<GetHotelDetailsResponse>(
        `/hotels/${hotelId}/details`,
        body
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAccommodationTypes: async (): Promise<GetAccommodationTypesResponse> => {
    try {
      const response = await api.get<GetAccommodationTypesResponse>(
        `/hotels/accommodation-types`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getHotelLocations: async (payload: GetHotelLocationsRequest): Promise<GetHotelLocationsResponse> => {
    try {
      const response = await api.get<GetHotelLocationsResponse>(
        `/hotels/locations/destinations`,
        {
          params: { search: payload.search } // Pass search as query parameter
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


