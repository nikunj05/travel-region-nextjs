import { api } from './api';
import { GetTestimonialsResponse, TestimonialFilters } from '@/types/testimonial';

export const testimonialService = {
  getTestimonials: async (filters?: TestimonialFilters): Promise<GetTestimonialsResponse> => {
    try {
      const params = new URLSearchParams();

      if (filters?.page !== undefined) {
        params.append('page', filters.page.toString());
      }

      if (filters?.per_page !== undefined) {
        params.append('per_page', filters.per_page.toString());
      }

      const url = `/testimonials${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<GetTestimonialsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
