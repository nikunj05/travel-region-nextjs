'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hotelService } from '@/services/hotelService'
import { GetHotelsRequest, HotelItem } from '@/types/hotel'
import { FavoriteHotel } from '@/types/favorite'
import { toast } from 'react-toastify'
import { formatApiErrorMessage } from '@/lib/formatApiError'
import { formatDateForAPI } from '@/lib/dateUtils'
import { Room } from './searchFiltersStore'

export interface HotelSearchFilters {
  checkIn: Date | null
  checkOut: Date | null
  rooms: Room[]
  language: string // e.g., 'eng'
  latitude: number | null
  longitude: number | null
  starRating: number | null // Single selected star rating (1-5)
  minPrice: number | null
  maxPrice: number | null
  accommodations: string | null // Comma-separated accommodation codes
}

interface HotelSearchState {
  // Filters and derived
  filters: HotelSearchFilters

  // Results
  hotels: (HotelItem | FavoriteHotel)[]
  currency: string | null
  total: number | null

  // Status
  loading: boolean
  error: string | null

  // Actions - filters
  setDates: (checkIn: Date | null, checkOut: Date | null) => void
  setRooms: (rooms: Room[]) => void
  setLanguage: (language: string) => void
  setCoordinates: (latitude: number | null, longitude: number | null) => void
  setStarRating: (starRating: number | null) => void
  setPriceRange: (minPrice: number | null, maxPrice: number | null) => void
  updateFilters: (patch: Partial<HotelSearchFilters>) => void
  resetFilters: () => void

  // Actions - search
  clearResults: () => void
  search: () => Promise<void>
}

const defaultFilters: HotelSearchFilters = {
  checkIn: null,
  checkOut: null,
  rooms: [{ adults: 1, children: 0 }],
  language: 'eng',
  latitude: null,
  longitude: null,
  starRating: null,
  minPrice: null,
  maxPrice: null,
  accommodations: null,
}

export const useHotelSearchStore = create<HotelSearchState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      hotels: [],
      currency: null,
      total: null,
      loading: false,
      error: null,

      setDates: (checkIn, checkOut) => set((state) => ({
        filters: { ...state.filters, checkIn, checkOut }
      })),

      setRooms: (rooms) => set((state) => ({
        filters: { ...state.filters, rooms }
      })),

      setLanguage: (language) => set((state) => ({
        filters: { ...state.filters, language }
      })),

      setCoordinates: (latitude, longitude) => set((state) => ({
        filters: { ...state.filters, latitude, longitude }
      })),

      setStarRating: (starRating) => set((state) => ({
        filters: { ...state.filters, starRating }
      })),

      setPriceRange: (minPrice, maxPrice) => set((state) => ({
        filters: { ...state.filters, minPrice, maxPrice }
      })),

      updateFilters: (patch) => set((state) => ({
        filters: { ...state.filters, ...patch }
      })),

      resetFilters: () => set({ filters: defaultFilters }),

      clearResults: () => set({ hotels: [], total: null, error: null, currency: null }),

      search: async () => {
        const { filters } = get()
        // Validate minimal required params
        if (!filters.checkIn || !filters.checkOut || filters.latitude == null || filters.longitude == null) {
          const errorMessage = 'Missing required search parameters'
          set({ error: errorMessage, loading: false })
          toast.error(errorMessage)
          return
        }

        set({ loading: true, error: null })
        try {
          const payload: GetHotelsRequest = {
            check_in: formatDateForAPI(filters.checkIn),
            check_out: formatDateForAPI(filters.checkOut),
            rooms: filters.rooms,
            language: filters.language,
            latitude: filters.latitude,
            longitude: filters.longitude,
          }

          // NOTE: Left sidebar filters (star rating, price range, property type)
          // are now applied on the client side only. We intentionally do NOT
          // send these extra filters to the listing API here so that the
          // full result-set can be filtered in the UI.

          console.log('Hotel search API payload:', payload)

          const res = await hotelService.getHotels(payload)
          console.log('Hotel search API response:', res)

          // Safely extract hotels array
          const hotelsData = res?.data?.hotels
          const hotels = Array.isArray(hotelsData) ? hotelsData : []
          const currency = hotels.length > 0 && 'currency' in hotels[0] ? (hotels[0] as HotelItem).currency : null

          console.log('Processed hotels:', { count: hotels.length, currency })

          set({ hotels, currency, total: hotels.length, loading: false })
        } catch (err: unknown) {
          console.error('Hotel search error details:', err)
          const errorMessage = formatApiErrorMessage(err)
          set({ error: errorMessage, loading: false, hotels: [] })
          toast.error(errorMessage)
        }
      },
    }),
    {
      name: 'hotel-search-storage',
      partialize: (state) => ({
        filters: {
          // Only persist essential search criteria, not filter values
          checkIn: state.filters.checkIn ? state.filters.checkIn.toISOString() : null,
          checkOut: state.filters.checkOut ? state.filters.checkOut.toISOString() : null,
          rooms: state.filters.rooms,
          language: state.filters.language,
          latitude: state.filters.latitude,
          longitude: state.filters.longitude,
          // Explicitly exclude filter values - they should reset on page refresh
          starRating: null,
          minPrice: null,
          maxPrice: null,
          accommodations: null,
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.filters.checkIn && typeof state.filters.checkIn === 'string') {
            state.filters.checkIn = new Date(state.filters.checkIn)
          }
          if (state.filters.checkOut && typeof state.filters.checkOut === 'string') {
            state.filters.checkOut = new Date(state.filters.checkOut)
          }
          // Ensure filter values are reset to null on rehydration
          state.filters.starRating = null
          state.filters.minPrice = null
          state.filters.maxPrice = null
          state.filters.accommodations = null
        }
      },
    }
  )
)


