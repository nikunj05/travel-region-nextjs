export interface Testimonial {
  id: number;
  name: string;
  location: string;
  photo: string;
  photo_url: string;
  message: string;
  rating: number;
  hotel: string;
  stay_date: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface TestimonialPagination {
  has_more_pages: boolean;
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  total: number;
}

export interface GetTestimonialsResponse {
  status: boolean;
  message: string;
  data: {
    testimonials: Testimonial[];
    pagination: TestimonialPagination;
  };
}

export interface TestimonialFilters {
  page?: number;
  per_page?: number;
}
