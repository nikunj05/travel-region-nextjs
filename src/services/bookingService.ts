import { api } from './api';
import { CreateBookingRequest, CreateBookingResponse, CheckoutRequest, CheckoutResponse } from '@/types';

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
  checkout: async (payload: CheckoutRequest): Promise<CheckoutResponse> => {
    try {
      const response = await api.post<CheckoutResponse, CheckoutRequest>(
        '/checkout',
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

