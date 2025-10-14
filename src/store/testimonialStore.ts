'use client'
import { create } from 'zustand'
import { Testimonial, TestimonialPagination, TestimonialFilters } from '@/types/testimonial'
import { testimonialService } from '@/services/testimonialService'

interface TestimonialState {
  testimonials: Testimonial[]
  pagination: TestimonialPagination | null
  loading: boolean
  error: string | null
  currentFilters: TestimonialFilters | null

  fetchTestimonials: (filters?: TestimonialFilters) => Promise<void>
  clearErrors: () => void
}

export const useTestimonialStore = create<TestimonialState>((set) => ({
  testimonials: [],
  pagination: null,
  loading: false,
  error: null,
  currentFilters: null,

  fetchTestimonials: async (filters?: TestimonialFilters) => {
    set({ loading: true, error: null, currentFilters: filters || null })

    try {
      const response = await testimonialService.getTestimonials({ ...filters })
      set({
        testimonials: response.data.testimonials,
        pagination: response.data.pagination,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch testimonials',
        loading: false,
      })
    }
  },

  clearErrors: () => {
    set({ error: null })
  },
}))
