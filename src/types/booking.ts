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
  special_requests?: string;
  room_details: RoomDetail[];
  details: BookingDetail[];
}

export interface CreateBookingResponse {
  status: boolean;
  message: string;
  data?: {
    booking_id?: string | number;
    [key: string]: unknown;
  };
}

