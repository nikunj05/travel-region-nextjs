'use client'
import { create } from 'zustand'
import { bookingService } from '@/services/bookingService'
import { GetBookingsRequest, GetBookingsResponse } from '@/types/booking'
import { toast } from 'react-toastify'
import { formatApiErrorMessage } from '@/lib/formatApiError'

interface BookingItem {
  id: number
  order: string
  hotel_code?: string | number
  status?: string
  check_in?: string
  check_out?: string
  adults?: number
  children?: number
  total_price?: number
  currency?: string
  // Enriched fields coming from API for display purposes
  hotel_name?: string
  hotel_location?: string
  hotel_images?: string | string[]
  [key: string]: unknown
}

interface BookingsListState {
  bookings: BookingItem[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchBookings: (params?: GetBookingsRequest) => Promise<void>
  clearError: () => void
}

export const useBookingsListStore = create<BookingsListState>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,

  fetchBookings: async (params?: GetBookingsRequest) => {
    set({ loading: true, error: null })
    try {
      const response = await bookingService.getBookings(params || {})
      
      if (response.status && response.data?.bookings) {
        set({
          bookings: response.data.bookings as BookingItem[],
          loading: false,
          error: null,
        })
      } else {
        set({
          bookings: [],
          loading: false,
          error: response.message || 'No bookings found',
        })
      }
    } catch (err: unknown) {
      console.error('Failed to fetch bookings:', err)
      const errorMessage = formatApiErrorMessage(err)
      set({
        error: errorMessage,
        loading: false,
        bookings: [],
      })
      toast.error(errorMessage)
    }
  },

  clearError: () => set({ error: null }),
}))

