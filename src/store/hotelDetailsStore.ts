'use client'
import { create } from 'zustand'
import { hotelService } from '@/services/hotelService'
import { HotelDetails as HotelDetailsType } from '@/types/hotel'
import { useSearchFiltersStore } from './searchFiltersStore'

interface FetchParams {
  hotelId: string
  language?: string
}

interface HotelDetailsState {
  hotel: HotelDetailsType | null
  loading: boolean
  error: string | null

  fetchHotel: (params: FetchParams) => Promise<void>
  clear: () => void
}

export const useHotelDetailsStore = create<HotelDetailsState>((set) => ({
  hotel: null,
  loading: false,
  error: null,

  fetchHotel: async ({ hotelId, language = 'ENG' }: FetchParams) => {
    set({ loading: true, error: null })
    try {
      const { filters } = useSearchFiltersStore.getState()
      
      if (!filters.checkInDate || !filters.checkOutDate) {
        set({ error: 'Please select check-in and check-out dates.', loading: false });
        return;
      }

      const payload = {
        hotelId,
        language,
        check_in: filters.checkInDate.toISOString().split('T')[0],
        check_out: filters.checkOutDate.toISOString().split('T')[0],
        rooms: filters.rooms
      }
      
      const response = await hotelService.getHotelDetails(payload)
      set({ hotel: response.data.hotel as HotelDetailsType, loading: false })
    } catch (err: unknown) {
      set({ error: (err as Error)?.message || 'Failed to fetch hotel details', loading: false })
    }
  },

  clear: () => set({ hotel: null, error: null }),
}))


