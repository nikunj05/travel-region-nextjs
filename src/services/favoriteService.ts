import { api } from './api';
import { 
  FavoriteHotelsResponse, 
  AddFavoriteRequest, 
  AddFavoriteResponse, 
  FavoriteHotelsParams 
} from '@/types/favorite';

export const favoriteService = {
  /**
   * Get user's favorite hotels
   * @param params - Query parameters for the request
   * @returns Promise<FavoriteHotelsResponse>
   */
  getFavoriteHotels: async (params?: FavoriteHotelsParams): Promise<FavoriteHotelsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.language) {
        queryParams.append('language', params.language);
      }
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `/favorite-hotels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<FavoriteHotelsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add a hotel to favorites
   * @param data - Hotel code to add to favorites
   * @returns Promise<AddFavoriteResponse>
   */
  addToFavorites: async (data: AddFavoriteRequest): Promise<AddFavoriteResponse> => {
    try {
      const response = await api.post<AddFavoriteResponse, AddFavoriteRequest>(
        '/favorite-hotels',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove a hotel from favorites
   * @param hotelCode - Hotel code to remove from favorites
   * @returns Promise<{ status: boolean; message: string }>
   */
  removeFromFavorites: async (hotelCode: number): Promise<{ status: boolean; message: string }> => {
    try {
      const response = await api.delete<{ status: boolean; message: string }>(
        `/favorite-hotels/${hotelCode}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 
};
