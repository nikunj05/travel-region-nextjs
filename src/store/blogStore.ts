'use client'
import { create } from 'zustand'
import { Blog, BlogFilters, BlogPagination, BlogCategory } from '@/types/blog'
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

  // Categories and Tags state
  categories: BlogCategory[]
  tags: string[]
  categoriesLoading: boolean
  tagsLoading: boolean
  categoriesError: string | null
  tagsError: string | null

  // Actions
  fetchBlogs: (filters?: BlogFilters) => Promise<void>
  fetchBlogBySlug: (slug: string) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchTags: () => Promise<void>
  clearCurrentBlog: () => void
  clearErrors: () => void
}

export const useBlogStore = create<BlogState>((set) => ({
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

  // Categories and Tags initial state
  categories: [],
  tags: [],
  categoriesLoading: false,
  tagsLoading: false,
  categoriesError: null,
  tagsError: null,

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

  // Fetch single blog by slug
  fetchBlogBySlug: async (slug: string) => {
    set({ detailLoading: true, detailError: null })
    
    try {
      const response = await blogService.getBlogBySlug(slug)
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

  // Fetch categories
  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null })
    
    try {
      const response = await blogService.getBlogCategories()
      set({ 
        categories: response.data.categories,
        categoriesLoading: false 
      })
    } catch (error) {
      set({ 
        categoriesError: error instanceof Error ? error.message : 'Failed to fetch categories',
        categoriesLoading: false 
      })
    }
  },

  // Fetch tags
  fetchTags: async () => {
    set({ tagsLoading: true, tagsError: null })
    
    try {
      const response = await blogService.getBlogTags()
      set({ 
        tags: response.data.tags,
        tagsLoading: false 
      })
    } catch (error) {
      set({ 
        tagsError: error instanceof Error ? error.message : 'Failed to fetch tags',
        tagsLoading: false 
      })
    }
  },

  // Clear all errors
  clearErrors: () => {
    set({ 
      error: null, 
      detailError: null,
      categoriesError: null,
      tagsError: null
    })
  },
}))
