'use client'
import { create } from 'zustand'
import { Blog, BlogFilters, BlogPagination } from '@/types/blog'
import { blogService } from '@/services/blogService'

interface BlogState {
  // Blog list state (with pagination)
  blogs: Blog[]
  pagination: BlogPagination | null
  loading: boolean
  error: string | null
  currentFilters: BlogFilters | null

  // Blog detail state
  currentBlog: Blog | null
  relatedBlogs: Blog[]
  detailLoading: boolean
  detailError: string | null

  // Actions
  fetchBlogs: (filters?: BlogFilters) => Promise<void>
  fetchBlogById: (id: number) => Promise<void>
  clearCurrentBlog: () => void
  clearErrors: () => void
}

export const useBlogStore = create<BlogState>((set, get) => ({
  // Initial state
  blogs: [],
  pagination: null,
  loading: false,
  error: null,
  currentFilters: null,
  
  currentBlog: null,
  relatedBlogs: [],
  detailLoading: false,
  detailError: null,

  // Fetch blogs with filters and pagination (default 15 blogs)
  fetchBlogs: async (filters?: BlogFilters) => {
    set({ loading: true, error: null, currentFilters: filters || null })
    
    try {
      const response = await blogService.getBlogs({ ...filters })
      set({ 
        blogs: response.data.blogs,
        pagination: response.data.pagination,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch blogs',
        loading: false 
      })
    }
  },

  // Fetch single blog by ID
  fetchBlogById: async (id: number) => {
    set({ detailLoading: true, detailError: null })
    
    try {
      const response = await blogService.getBlogById(id)
      set({ 
        currentBlog: response.data.blog,
        relatedBlogs: response.data.related_blogs,
        detailLoading: false 
      })
    } catch (error) {
      set({ 
        detailError: error instanceof Error ? error.message : 'Failed to fetch blog details',
        detailLoading: false 
      })
    }
  },

  // Clear current blog (useful when navigating away from detail page)
  clearCurrentBlog: () => {
    set({ 
      currentBlog: null, 
      relatedBlogs: [],
      detailError: null 
    })
  },

  // Clear all errors
  clearErrors: () => {
    set({ 
      error: null, 
      detailError: null 
    })
  },
}))
