'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hotelService } from '@/services/hotelService'
import { GetHotelsRequest, HotelItem } from '@/types/hotel'
import { FavoriteHotel } from '@/types/favorite'
import { toast } from 'react-toastify'
import { formatApiErrorMessage } from '@/lib/formatApiError'
import { formatDateForAPI } from '@/lib/dateUtils'

export interface HotelSearchFilters {
  checkIn: Date | null
  checkOut: Date | null
  rooms: number
  adults: number
  children: number
  language: string // e.g., 'eng'
  latitude: number | null
  longitude: number | null
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
  setGuests: (adults: number, children: number, rooms?: number) => void
  setLanguage: (language: string) => void
  setCoordinates: (latitude: number | null, longitude: number | null) => void
  updateFilters: (patch: Partial<HotelSearchFilters>) => void
  resetFilters: () => void

  // Actions - search
  search: () => Promise<void>
}

const defaultFilters: HotelSearchFilters = {
  checkIn: null,
  checkOut: null,
  rooms: 1,
  adults: 1,
  children: 0,
  language: 'eng',
  latitude: null,
  longitude: null,
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

      setGuests: (adults, children, rooms) => set((state) => ({
        filters: { ...state.filters, adults, children, rooms: rooms ?? state.filters.rooms }
      })),

      setLanguage: (language) => set((state) => ({
        filters: { ...state.filters, language }
      })),

      setCoordinates: (latitude, longitude) => set((state) => ({
        filters: { ...state.filters, latitude, longitude }
      })),

      updateFilters: (patch) => set((state) => ({
        filters: { ...state.filters, ...patch }
      })),

      resetFilters: () => set({ filters: defaultFilters }),

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
            adults: filters.adults,
            children: filters.children,
            language: filters.language,
            latitude: filters.latitude,
            longitude: filters.longitude,
          }

          const res = await hotelService.getHotels(payload)
          const hotels = (res.data?.hotels ?? []) as unknown as (HotelItem | FavoriteHotel)[]
          const currency = hotels.length > 0 && 'currency' in hotels[0] ? (hotels[0] as HotelItem).currency : null

          set({ hotels, currency, total: hotels.length, loading: false })
        } catch (err: unknown) {
          const errorMessage = formatApiErrorMessage(err)
          set({ error: errorMessage, loading: false })
          toast.error(errorMessage)
        }
      },
    }),
    {
      name: 'hotel-search-storage',
      partialize: (state) => ({
        filters: {
          ...state.filters,
          checkIn: state.filters.checkIn ? state.filters.checkIn.toISOString() : null,
          checkOut: state.filters.checkOut ? state.filters.checkOut.toISOString() : null,
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
        }
      },
    }
  )
)


