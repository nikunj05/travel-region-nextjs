import { FavoriteHotelsResponse, FavoriteHotelsParams, AddFavoriteRequest, AddFavoriteResponse, FavoriteHotelsData } from "@/types/favorite";
import { api } from "./api";

export const favoriteService = {
  getFavorites: async (params?: FavoriteHotelsParams): Promise<FavoriteHotelsData> => {
    const response = await api.get<FavoriteHotelsResponse>("/favorite-hotels", {
      params,
    });
    return response.data.data.favorites;
  },
  addFavorite: async (hotelCode: number | string): Promise<AddFavoriteResponse> => {
    const payload: AddFavoriteRequest = { hotel_code: hotelCode };
    const response = await api.post<AddFavoriteResponse>('/favorite-hotels', payload);
    return response.data;
  },
  removeFavorite: async (hotelCode: number | string): Promise<{ status: boolean; message: string }> => {
    const response = await api.delete<{ status: boolean; message: string }>(`/favorite-hotels/${hotelCode}`);
    return response.data;
  },
};
