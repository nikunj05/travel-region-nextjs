'use client'
import { create } from 'zustand'
import { notificationService } from '@/services/notificationService'
import { NotificationPreferences, UpdateNotificationPreferencesRequest } from '@/types/notification'

interface NotificationState {
  preferences: NotificationPreferences | null
  loading: boolean
  error: string | null
  updating: boolean
  updateError: string | null

  fetchPreferences: () => Promise<void>
  updatePreferences: (data: UpdateNotificationPreferencesRequest) => Promise<void>
  setLocalPreferences: (data: Partial<NotificationPreferences>) => void
  clearErrors: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  preferences: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,

  fetchPreferences: async () => {
    set({ loading: true, error: null })
    try {
      const res = await notificationService.getNotificationPreferences()
      set({ preferences: res.data.preferences, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load preferences', loading: false })
    }
  },

  updatePreferences: async (data: UpdateNotificationPreferencesRequest) => {
    set({ updating: true, updateError: null })
    try {
      const res = await notificationService.updateNotificationPreferences(data)
      set({ preferences: res.data.preferences, updating: false })
    } catch (err) {
      set({ updateError: err instanceof Error ? err.message : 'Failed to update preferences', updating: false })
    }
  },

  setLocalPreferences: (data: Partial<NotificationPreferences>) => {
    const current = get().preferences
    set({ preferences: { ...(current ?? ({} as NotificationPreferences)), ...data } })
  },

  clearErrors: () => set({ error: null, updateError: null }),

  clear: () => set({ preferences: null, error: null, updateError: null })
}))


