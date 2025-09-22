'use client'
import { create } from 'zustand'
import { AppSetting } from '@/types/settings'

interface SettingsState {
  setting: AppSetting | null
  setSetting: (setting: AppSetting) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  setting: null,
  setSetting: (setting) => set({ setting }),
}))


