'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HotelRateCancellationPolicy } from '@/types/hotel'
import { bookingService } from '@/services/bookingService'
import { CreateBookingRequest, CreateBookingResponse } from '@/types/booking'
import { toast } from 'react-toastify'
import { formatApiErrorMessage } from '@/lib/formatApiError'
import { BookingFormData } from '@/schemas/bookingSchema'

// Selected room interface
export interface SelectedRoom {
  roomCode: string
  roomName: string
  rateKey: string
  boardCode: string
  boardName: string
  count: number // number of rooms selected
  pricePerRoom: number
  totalPrice: number
  currency: string
  cancellationPolicies?: HotelRateCancellationPolicy[]
  adults: number
  children: number
}

// Booking data interface
export interface BookingData {
  hotelId: string
  hotelName: string
  selectedRooms: SelectedRoom[]
  totalAmount: number
  currency: string
  timestamp: number // when the booking data was saved
}

interface BookingState {
  bookingData: BookingData | null

  // Traveler details
  travelerDetails: BookingFormData | null

  // API state
  loading: boolean
  error: string | null
  bookingResponse: CreateBookingResponse | null

  // Actions
  setBookingData: (data: BookingData) => void
  clearBookingData: () => void
  addSelectedRoom: (room: SelectedRoom) => void
  removeSelectedRoom: (roomCode: string) => void
  updateRoomCount: (roomCode: string, count: number) => void

  // Traveler details actions
  setTravelerDetails: (details: BookingFormData) => void
  clearTravelerDetails: () => void

  // API actions
  createBooking: (payload: CreateBookingRequest) => Promise<CreateBookingResponse | null>
  clearBookingResponse: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookingData: null,
      travelerDetails: null,
      loading: false,
      error: null,
      bookingResponse: null,

      setBookingData: (data) => {
        set({
          bookingData: {
            ...data,
            timestamp: Date.now()
          }
        })
      },

      clearBookingData: () => {
        set({ bookingData: null })
      },

      addSelectedRoom: (room) => {
        const { bookingData } = get()
        if (!bookingData) return

        const existingRooms = bookingData.selectedRooms || []
        const existingIndex = existingRooms.findIndex(r => r.roomCode === room.roomCode)

        if (existingIndex >= 0) {
          // Update existing room
          existingRooms[existingIndex] = room
        } else {
          // Add new room
          existingRooms.push(room)
        }

        const totalAmount = existingRooms.reduce((sum, r) => sum + r.totalPrice, 0)

        set({
          bookingData: {
            ...bookingData,
            selectedRooms: existingRooms,
            totalAmount,
            timestamp: Date.now()
          }
        })
      },

      removeSelectedRoom: (roomCode) => {
        const { bookingData } = get()
        if (!bookingData) return

        const filteredRooms = bookingData.selectedRooms.filter(r => r.roomCode !== roomCode)
        const totalAmount = filteredRooms.reduce((sum, r) => sum + r.totalPrice, 0)

        set({
          bookingData: {
            ...bookingData,
            selectedRooms: filteredRooms,
            totalAmount,
            timestamp: Date.now()
          }
        })
      },

      updateRoomCount: (roomCode, count) => {
        const { bookingData } = get()
        if (!bookingData) return

        const updatedRooms = bookingData.selectedRooms.map(room => {
          if (room.roomCode === roomCode) {
            const totalPrice = room.pricePerRoom * count
            return { ...room, count, totalPrice }
          }
          return room
        })

        const totalAmount = updatedRooms.reduce((sum, r) => sum + r.totalPrice, 0)

        set({
          bookingData: {
            ...bookingData,
            selectedRooms: updatedRooms,
            totalAmount,
            timestamp: Date.now()
          }
        })
      },

      setTravelerDetails: (details) => {
        set({ travelerDetails: details })
      },

      clearTravelerDetails: () => {
        set({ travelerDetails: null })
      },

      createBooking: async (payload: CreateBookingRequest) => {
        set({ loading: true, error: null, bookingResponse: null })
        try {
          console.log('🚀 Creating booking with payload:', payload)

          const response = await bookingService.createBooking(payload)

          console.log('✅ Booking API Response:', response)
          console.log('📋 Response Status:', response.status)
          console.log('📋 Response Message:', response.message)
          if (response.data) {
            console.log('📋 Response Data:', response.data)
          }

          set({
            bookingResponse: response,
            loading: false,
            error: null
          })

          // if (response.status) {
          //   toast.success(response.message || 'Booking created successfully!')
          // } else {
          //   toast.error(response.message || 'Booking failed')
          // }

          return response
        } catch (err: unknown) {
          console.error('❌ Booking creation error:', err)
          const errorMessage = formatApiErrorMessage(err)
          set({
            error: errorMessage,
            loading: false,
            bookingResponse: null
          })
          toast.error(errorMessage)
          return null
        }
      },

      clearBookingResponse: () => {
        set({ bookingResponse: null, error: null })
      },
    }),
    {
      name: 'booking-storage',
    }
  )
)

