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

// Room interface for guest counts
export interface Room {
  adults: number;
  children: number;
}

// Search filters interface
export interface SearchFilters {
  location: Location | null
  checkInDate: Date | null
  checkOutDate: Date | null
  rooms: Room[]
  freeCancellation: boolean
}

interface SearchFiltersState {
  // Filter values
  filters: SearchFilters
  
  // Actions
  setLocation: (location: Location | null) => void
  setCheckInDate: (date: Date | null) => void
  setCheckOutDate: (date: Date | null) => void
  setRooms: (rooms: Room[]) => void
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
  rooms: [{ adults: 2, children: 1 }],
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

      setRooms: (rooms) =>
        set((state) => ({
          filters: { ...state.filters, rooms }
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
        const rooms = filters.rooms || []
        const totalAdults = rooms.reduce((acc, room) => acc + (room?.adults || 0), 0);
        return !!(
          filters.location &&
          filters.checkInDate &&
          filters.checkOutDate &&
          totalAdults > 0
        )
      },
    }),
    {
      name: 'search-filters-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          
          // Migrate from old guestCounts structure to new rooms structure
          let rooms = state.filters?.rooms
          if (!rooms && state.filters?.guestCounts) {
            // Migrate old guestCounts to rooms array
            const guestCounts = state.filters.guestCounts
            rooms = [{ adults: guestCounts.adults || 2, children: guestCounts.children || 1 }]
          }
          // Ensure rooms is an array, fallback to default
          if (!Array.isArray(rooms) || rooms.length === 0) {
            rooms = [{ adults: 2, children: 1 }]
          }
          
          return {
            state: {
              ...state,
              filters: {
                ...state.filters,
                checkInDate: state.filters.checkInDate ? new Date(state.filters.checkInDate) : null,
                checkOutDate: state.filters.checkOutDate ? new Date(state.filters.checkOutDate) : null,
                rooms: rooms,
                // Remove old guestCounts if it exists
                guestCounts: undefined,
              }
            }
          }
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              filters: {
                ...newValue.state.filters,
                checkInDate: newValue.state.filters.checkInDate?.toISOString() || null,
                checkOutDate: newValue.state.filters.checkOutDate?.toISOString() || null,
              }
            }
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
