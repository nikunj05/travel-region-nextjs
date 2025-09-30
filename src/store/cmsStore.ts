'use client'
import { create } from 'zustand'
import { CmsPageItem } from '@/types/cms'
import { cmsService } from '@/services/cmsService'

interface CmsState {
  pages: CmsPageItem[]
  loading: boolean
  error: string | null
  // detail state
  currentPage: CmsPageItem | null
  detailLoading: boolean
  detailError: string | null
  // actions
  fetchPages: () => Promise<void>
  fetchPageBySlug: (slug: string) => Promise<void>
  clearCurrentPage: () => void
}

export const useCmsStore = create<CmsState>((set, get) => ({
  pages: [],
  loading: false,
  error: null,
  currentPage: null,
  detailLoading: false,
  detailError: null,

  fetchPages: async () => {
    // Avoid refetch if already loaded
    if (get().pages.length > 0) return
    set({ loading: true, error: null })
    try {
      const res = await cmsService.getPages()
      set({ pages: res.data.content, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch CMS pages',
        loading: false,
      })
    }
  },

  fetchPageBySlug: async (slug: string) => {
    set({ detailLoading: true, detailError: null })
    try {
      const res = await cmsService.getPageBySlug(slug)
      set({ currentPage: res.data.content, detailLoading: false })
    } catch (error) {
      set({ 
        detailError: error instanceof Error ? error.message : 'Failed to fetch CMS page',
        detailLoading: false,
      })
    }
  },

  clearCurrentPage: () => set({ currentPage: null, detailError: null }),
}))


