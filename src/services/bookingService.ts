import { api } from './api';
import {
  CreateBookingRequest,
  CreateBookingResponse,
  CheckoutRequest,
  CheckoutResponse,
  BookingDetailsResponse,
  GetBookingsRequest,
  GetBookingsResponse,
  ApplyCouponRequest,
  ApplyCouponResponse,
} from '@/types';

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
  getBookingDetails: async (order: string): Promise<BookingDetailsResponse> => {
    try {
      const response = await api.get<BookingDetailsResponse>(
        `/bookings/${order}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getBookings: async (params: GetBookingsRequest): Promise<GetBookingsResponse> => {
    try {
      const response = await api.get<GetBookingsResponse>('/bookings', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (
    order: string
  ): Promise<{
    status: boolean;
    message: string;
    [key: string]: unknown;
  }> => {
    try {
      // Example full URL:
      // {{BASE_URL}}/bookings/ord_692d402f781c9/cancel
      const response = await api.delete<
        {
          status: boolean;
          message: string;
          [key: string]: unknown;
        }
      >(`/bookings/${order}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookingPdf: async (
    order: string
  ): Promise<{
    status: boolean;
    message: string;
    data: { pdf_url: string };
  }> => {
    try {
      const response = await api.get<{
        status: boolean;
        message: string;
        data: { pdf_url: string };
      }>(`/bookings/${order}/pdf`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCancellationPolicies: async (
    order: string
  ): Promise<{
    status: boolean;
    message: string;
    data?: unknown;
    [key: string]: unknown;
  }> => {
    try {
      const response = await api.get<{
        status: boolean;
        message: string;
        data?: unknown;
        [key: string]: unknown;
      }>(`/bookings/${order}/cancellation-policies`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  applyCoupon: async (payload: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
    try {
      const response = await api.post<ApplyCouponResponse>(
        '/apply-coupon',
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

