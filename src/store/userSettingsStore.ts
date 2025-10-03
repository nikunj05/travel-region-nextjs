'use client'
import { create } from 'zustand'
import { UserSettings, UserSettingsResponse, UpdateUserSettingsRequest, UpdateUserSettingsResponse } from '@/types/user'
import { userService } from '@/services/userService'

interface UserSettingsState {
  // User settings state
  userSettings: UserSettings | null
  loading: boolean
  error: string | null
  
  // Update state
  updating: boolean
  updateError: string | null
  
  // Actions
  fetchUserSettings: () => Promise<void>
  updateUserSettings: (data: UpdateUserSettingsRequest) => Promise<void>
  clearErrors: () => void
  clearUserSettings: () => void
}

export const useUserSettingsStore = create<UserSettingsState>((set, get) => ({
  // Initial state
  userSettings: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,

  // Fetch user settings
  fetchUserSettings: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await userService.getUserSettings()
      set({ 
        userSettings: response.data.user_settings,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user settings',
        loading: false 
      })
    }
  },

  // Update user settings
  updateUserSettings: async (data: UpdateUserSettingsRequest) => {
    set({ updating: true, updateError: null })
    
    try {
      const response = await userService.updateUserSettings(data)
      
      // Update the local state with the new data
      const currentSettings = get().userSettings
      if (currentSettings) {
        set({ 
          userSettings: {
            ...currentSettings,
            ...(data.language !== undefined && { language: data.language }),
            ...(data.currency !== undefined && { currency: data.currency }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.country_code !== undefined && { country_code: data.country_code }),
            ...(data.mobile !== undefined && { mobile: data.mobile })
          },
          updating: false 
        })
      } else {
        // If no current settings, fetch them again
        await get().fetchUserSettings()
        set({ updating: false })
      }
    } catch (error) {
      set({ 
        updateError: error instanceof Error ? error.message : 'Failed to update user settings',
        updating: false 
      })
    }
  },

  // Clear all errors
  clearErrors: () => {
    set({ 
      error: null, 
      updateError: null
    })
  },

  // Clear user settings (useful when logging out)
  clearUserSettings: () => {
    set({ 
      userSettings: null,
      error: null,
      updateError: null
    })
  },
}))
