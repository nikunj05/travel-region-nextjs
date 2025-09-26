import { api } from './api';
import { GetBlogsResponse, BlogFilters, GetBlogDetailResponse, GetBlogTagsResponse, GetBlogCategoriesResponse, AddCommentRequest, AddCommentResponse } from '@/types/blog';

export const blogService = {
  /**
   * Get blogs with optional filters
   * @param filters - Optional filters for blogs (is_featured, category_id, tags, page, per_page, sort_by, sort_order)
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

      if (filters?.sort_by) {
        params.append('sort_by', filters.sort_by);
      }
      
      if (filters?.sort_order) {
        params.append('sort_order', filters.sort_order);
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

  /**
   * Get all blog tags
   * @returns Promise<GetBlogTagsResponse>
   */
  getBlogTags: async (): Promise<GetBlogTagsResponse> => {
    try {
      const response = await api.get<GetBlogTagsResponse>('/blog-tags');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all blog categories
   * @returns Promise<GetBlogCategoriesResponse>
   */
  getBlogCategories: async (): Promise<GetBlogCategoriesResponse> => {
    try {
      const response = await api.get<GetBlogCategoriesResponse>('/blog-categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add a comment to a blog
   * @param blogId - Blog ID
   * @param commentData - Comment data containing the comment text
   * @returns Promise<AddCommentResponse>
   */
  addComment: async (blogId: number, commentData: AddCommentRequest): Promise<AddCommentResponse> => {
    try {
      const response = await api.post<AddCommentResponse, AddCommentRequest>(`/blogs/${blogId}/comment`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
