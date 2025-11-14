import { api } from './api';
import { CreateBookingRequest, CreateBookingResponse } from '@/types';

export const bookingService = {
  createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
    try {
      const response = await api.post<CreateBookingResponse, CreateBookingRequest>(
        '/bookings',
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

