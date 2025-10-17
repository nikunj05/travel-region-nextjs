'use client'
import { create } from 'zustand'
import { hotelService } from '@/services/hotelService'
import { HotelDetails as HotelDetailsType } from '@/types/hotel'

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
      const response = await hotelService.getHotelDetails({ hotelId, language })
      set({ hotel: response.data.hotel as HotelDetailsType, loading: false })
    } catch (err: any) {
      set({ error: err?.message || 'Failed to fetch hotel details', loading: false })
    }
  },

  clear: () => set({ hotel: null, error: null }),
}))


