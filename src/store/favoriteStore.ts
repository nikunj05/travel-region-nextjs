'use client'
import { create } from "zustand";
import { favoriteService } from "@/services/favoriteService";
import { FavoriteHotel, FavoriteHotelsParams } from "@/types/favorite";

interface FavoriteState {
  favorites: FavoriteHotel[];
  total: number;
  from: number;
  to: number;
  loading: boolean;
  removing: boolean;
  error: string | null;
  fetchFavorites: (params?: FavoriteHotelsParams) => Promise<void>;
  addFavorite: (hotelCode: number | string) => Promise<void>;
  removeFavorite: (hotelCode: number | string) => Promise<void>;
  removeFromFavorites: (hotelCode: number | string) => Promise<void>;
  clearError: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  total: 0,
  from: 0,
  to: 0,
  loading: false,
  removing: false,
  error: null,
  fetchFavorites: async (params?: FavoriteHotelsParams) => {
    set({ loading: true, error: null });
    try {
      const favoritesData = await favoriteService.getFavorites(params);
      set({
        favorites: favoritesData.hotels,
        total: favoritesData.total,
        from: favoritesData.from,
        to: favoritesData.to,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch favorites", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load favorite hotels.",
        loading: false,
      });
    }
  },
  addFavorite: async (hotelCode: number | string) => {
    try {
      await favoriteService.addFavorite(hotelCode);
      await get().fetchFavorites();
    } catch (error) {
      console.error("Failed to add favorite", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to add favorite.",
      });
    }
  },
  removeFavorite: async (hotelCode: number | string) => {
    set({ removing: true, error: null });
    try {
      await favoriteService.removeFavorite(hotelCode);

      const hotelCodeStr = String(hotelCode);
      set((state) => {
        const updatedFavorites = state.favorites.filter(
          (fav) => String(fav.code) !== hotelCodeStr
        );

        return {
          ...state,
          favorites: updatedFavorites,
          total: Math.max(0, updatedFavorites.length),
          removing: false,
        };
      });

      await get().fetchFavorites();
    } catch (error) {
      console.error("Failed to remove favorite", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove favorite.",
        removing: false,
      });
    }
  },
  removeFromFavorites: async (hotelCode: number | string) => {
    await get().removeFavorite(hotelCode);
  },
  clearError: () => set({ error: null }),
}));
