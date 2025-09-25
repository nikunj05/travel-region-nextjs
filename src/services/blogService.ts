import { api } from './api';
import { GetBlogsResponse, BlogFilters, GetBlogDetailResponse } from '@/types/blog';

export const blogService = {
  /**
   * Get blogs with optional filters
   * @param filters - Optional filters for blogs (is_featured, category_id, tags, page, per_page)
   * @returns Promise<GetBlogsResponse>
   */
  getBlogs: async (filters?: BlogFilters): Promise<GetBlogsResponse> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters?.is_featured !== undefined) {
        params.append('is_featured', filters.is_featured.toString());
      }
      
      if (filters?.category_id) {
        params.append('category_id', filters.category_id);
      }
      
      if (filters?.tags) {
        params.append('tags', filters.tags);
      }
      
      if (filters?.page !== undefined) {
        params.append('page', filters.page.toString());
      }
      
      if (filters?.per_page !== undefined) {
        params.append('per_page', filters.per_page.toString());
      }

      // Build the URL with query parameters
      const url = `/blogs${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await api.get<GetBlogsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single blog by ID
   * @param id - Blog ID
   * @returns Promise<GetBlogDetailResponse>
   */
  getBlogById: async (id: number): Promise<GetBlogDetailResponse> => {
    try {
      const response = await api.get<GetBlogDetailResponse>(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
