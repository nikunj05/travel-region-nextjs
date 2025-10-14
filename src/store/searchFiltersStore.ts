'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Location interface matching LocationPicker
export interface Location {
  id: string
  name: string
  country: string
  region?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// Guest counts interface
export interface GuestCounts {
  adults: number
  children: number
  pets: number
}

// Search filters interface
export interface SearchFilters {
  location: Location | null
  checkInDate: Date | null
  checkOutDate: Date | null
  guestCounts: GuestCounts
  freeCancellation: boolean
}

interface SearchFiltersState {
  // Filter values
  filters: SearchFilters
  
  // Actions
  setLocation: (location: Location | null) => void
  setCheckInDate: (date: Date | null) => void
  setCheckOutDate: (date: Date | null) => void
  setGuestCounts: (guestCounts: GuestCounts) => void
  setFreeCancellation: (enabled: boolean) => void
  
  // Bulk actions
  updateFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  
  // Validation
  isValidForSearch: () => boolean
}

// Default filter values
const defaultFilters: SearchFilters = {
  location: null,
  checkInDate: null,
  checkOutDate: null,
  guestCounts: {
    adults: 2,
    children: 1,
    pets: 0,
  },
  freeCancellation: false,
}

export const useSearchFiltersStore = create<SearchFiltersState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,

      setLocation: (location) =>
        set((state) => ({
          filters: { ...state.filters, location }
        })),

      setCheckInDate: (date) =>
        set((state) => ({
          filters: { ...state.filters, checkInDate: date }
        })),

      setCheckOutDate: (date) =>
        set((state) => ({
          filters: { ...state.filters, checkOutDate: date }
        })),

      setGuestCounts: (guestCounts) =>
        set((state) => ({
          filters: { ...state.filters, guestCounts }
        })),

      setFreeCancellation: (enabled) =>
        set((state) => ({
          filters: { ...state.filters, freeCancellation: enabled }
        })),

      updateFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),

      resetFilters: () =>
        set({ filters: defaultFilters }),

      isValidForSearch: () => {
        const { filters } = get()
        return !!(
          filters.location &&
          filters.checkInDate &&
          filters.checkOutDate &&
          filters.guestCounts.adults > 0
        )
      },
    }),
    {
      name: 'search-filters-storage', // unique name for localStorage key
      // Only persist certain fields to avoid storing Date objects directly
      partialize: (state) => ({
        filters: {
          ...state.filters,
          checkInDate: state.filters.checkInDate?.toISOString() || null,
          checkOutDate: state.filters.checkOutDate?.toISOString() || null,
        }
      }),
      // Restore Date objects from ISO strings
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.filters.checkInDate && typeof state.filters.checkInDate === 'string') {
            state.filters.checkInDate = new Date(state.filters.checkInDate)
          }
          if (state.filters.checkOutDate && typeof state.filters.checkOutDate === 'string') {
            state.filters.checkOutDate = new Date(state.filters.checkOutDate)
          }
        }
      },
    }
  )
)
