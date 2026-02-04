export interface RoomDetail {
  rate_key: string;
  room_code: string;
  room_name?: string;
  board_name?: string;
}

export interface BookingDetail {
  id?: number;
  booking_id?: number;
  price_per_night?: number | string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  country_code: string;
  phone: string;
  is_primary: number | boolean; // API returns 1/0, but can be boolean in some cases
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ChildData {
  count: number;
  ages: number[];
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
  child_age_data?: number[];
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

export interface RoomDetailWithComments {
  id?: number;
  booking_id?: number;
  room_code: string;
  room_name?: string;
  rate_key: string;
  rate_comments?: string | null;
  amount?: string;
  board_name?: string;
  net_amount?: string | null;
  net_currency?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface BookingDetailsData {
  booking?: {
    id?: number;
    order: string;
    status?: string;
    details?: BookingDetail[];
    room_details?: RoomDetailWithComments[];
    special_requests?: string;
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
  page?: number;
  per_page?: number;
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
    pagination?: {
      has_more_pages: boolean;
      current_page: number;
      from: number;
      to: number;
      per_page: number;
      total: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}


export interface ApplyCouponRequest {
  coupon_code: string;
  order: string;
}

export interface ApplyCouponResponse {
  status: boolean;
  message: string;
  data?: {
    booking?: {
      discount_amount?: string | number;
      total_price?: string | number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}
