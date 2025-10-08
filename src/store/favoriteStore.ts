'use client'
import { create } from 'zustand'
import { FavoriteHotel, FavoriteHotelsParams } from '@/types/favorite'
import { favoriteService } from '@/services/favoriteService'

interface FavoriteState {
  // Favorite hotels state
  favorites: FavoriteHotel[]
  total: number
  from: number
  to: number
  loading: boolean
  error: string | null
  currentParams: FavoriteHotelsParams | null
  
  // Add/Remove state
  adding: boolean
  removing: boolean
  actionError: string | null

  // Actions
  fetchFavorites: (params?: FavoriteHotelsParams) => Promise<void>
  addToFavorites: (hotelCode: number) => Promise<void>
  removeFromFavorites: (hotelCode: number) => Promise<void>
  clearErrors: () => void
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  // Initial state
  favorites: [],
  total: 0,
  from: 0,
  to: 0,
  loading: false,
  error: null,
  currentParams: null,
  
  adding: false,
  removing: false,
  actionError: null,

  // Fetch all favorite hotels
  fetchFavorites: async (params?: FavoriteHotelsParams) => {
    set({ loading: true, error: null, currentParams: params || null })
    
    try {
      const response = await favoriteService.getFavoriteHotels(params)
      console.log('Favorite Hotels Data:', response.data.favorites)
      
      set({ 
        favorites: response.data.favorites.hotels,
        total: response.data.favorites.total,
        from: response.data.favorites.from,
        to: response.data.favorites.to,
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching favorites:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch favorite hotels',
        loading: false 
      })
    }
  },

  // Add hotel to favorites
  addToFavorites: async (hotelCode: number) => {
    set({ adding: true, actionError: null })
    
    try {
      const response = await favoriteService.addToFavorites({ hotel_code: hotelCode })
      console.log('Added to favorites:', response)
      
      set({ adding: false })
      
      // Refetch favorites to update the list
      const state = useFavoriteStore.getState()
      await state.fetchFavorites()
    } catch (error) {
      console.error('Error adding to favorites:', error)
      set({ 
        actionError: error instanceof Error ? error.message : 'Failed to add to favorites',
        adding: false 
      })
    }
  },

  // Remove hotel from favorites
  removeFromFavorites: async (hotelCode: number) => {
    set({ removing: true, actionError: null })
    
    try {
      const response = await favoriteService.removeFromFavorites(hotelCode)
      console.log('Removed from favorites:', response)
      
      // Remove the hotel from the local state immediately for better UX
      set((state) => ({
        favorites: state.favorites.filter(hotel => hotel.code !== hotelCode),
        total: state.total - 1,
        removing: false
      }))
    } catch (error) {
      console.error('Error removing from favorites:', error)
      set({ 
        actionError: error instanceof Error ? error.message : 'Failed to remove from favorites',
        removing: false 
      })
    }
  },

  // Clear all errors
  clearErrors: () => {
    set({ 
      error: null, 
      actionError: null
    })
  },
}))
