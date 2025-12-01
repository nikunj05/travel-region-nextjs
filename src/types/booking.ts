export interface RoomDetail {
  rate_key: string;
  room_code: string;
}

export interface BookingDetail {
  price_per_night: number;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  country_code: string;
  phone: string;
  is_primary: boolean;
}

export interface CreateBookingRequest {
  hotel_code: number;
  check_in: string; // YYYY-MM-DD format
  check_out: string; // YYYY-MM-DD format
  rooms: number;
  adults: number;
  children: number;
  nights: number;
  total_price: number;
  currency: string;
  hotel_name?: string;
  hotel_location?: string;
  hotel_images?: string;
  special_requests?: string;
  room_details: RoomDetail[];
  details: BookingDetail[];
}

export interface CreateBookingResponse {
  status: boolean;
  message: string;
  data?: {
    booking_id?: string | number;
    booking?: {
      id: number;
      order: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export interface CheckoutRequest {
  order: string;
}

export interface CheckoutResponse {
  status: boolean;
  message: string;
  data?: {
    checkout?: {
      id?: string;
      transaction?: {
        url?: string;
        timezone?: string;
        created?: string;
        amount?: number;
        currency?: string;
        [key: string]: unknown;
      };
      redirect?: {
        status?: string;
        url?: string;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export interface BookingDetailsData {
  booking?: {
    id?: number;
    order: string;
    details?: BookingDetail[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface BookingDetailsResponse {
  status: boolean;
  message: string;
  data?: BookingDetailsData;
}

export interface GetBookingsRequest {
  status?: string;
  hotel_code?: string | number;
}

export interface GetBookingsResponse {
  status: boolean;
  message: string;
  data?: {
    bookings?: Array<{
      id: number;
      order: string;
      hotel_code?: string | number;
      status?: string;
      check_in?: string;
      check_out?: string;
      total_price?: number;
      currency?: string;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
}

