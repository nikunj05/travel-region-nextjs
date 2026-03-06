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
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  
  // Actions
  fetchBookings: (params?: GetBookingsRequest) => Promise<void>
  clearError: () => void
}

export const useBookingsListStore = create<BookingsListState>((set) => ({
  bookings: [],
  loading: false,
  error: null,
  total: 0,
  perPage: 10,
  currentPage: 1,
  lastPage: 1,

  fetchBookings: async (params?: GetBookingsRequest) => {
    set({ loading: true, error: null })
    try {
      const response = await bookingService.getBookings(params || {})
      
      if (response.status && response.data?.bookings) {
        const pagination = response.data.pagination
        const total = pagination?.total ?? 0
        const perPage = pagination?.per_page ?? 10
        const currentPage = pagination?.current_page ?? 1
        const lastPage = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1

        set({
          bookings: response.data.bookings as BookingItem[],
          loading: false,
          error: null,
          total,
          perPage,
          currentPage,
          lastPage,
        })
      } else {
        set({
          bookings: [],
          loading: false,
          error: response.message || 'No bookings found',
          total: 0,
          perPage: 10,
          currentPage: 1,
          lastPage: 1,
        })
      }
    } catch (err: unknown) {
      console.error('Failed to fetch bookings:', err)
      const errorMessage = formatApiErrorMessage(err)
      set({
        error: errorMessage,
        loading: false,
        bookings: [],
        total: 0,
        perPage: 10,
        currentPage: 1,
        lastPage: 1,
      })
      toast.error(errorMessage)
    }
  },

  clearError: () => set({ error: null }),
}))

