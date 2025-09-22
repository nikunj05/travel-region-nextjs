"use client"
import { useEffect, useRef } from 'react'
import { AppSetting } from '@/types/settings'
import { useSettingsStore } from '@/store/settingsStore'

interface SettingsHydratorProps {
  setting: AppSetting
}

export default function SettingsHydrator({ setting }: SettingsHydratorProps) {
  const setSetting = useSettingsStore((s) => s.setSetting)
  const lastSerialized = useRef<string>("")

  useEffect(() => {
    if (!setting) return
    const serialized = JSON.stringify(setting)
    if (serialized !== lastSerialized.current) {
      setSetting(setting)
      lastSerialized.current = serialized
    }
  }, [setting, setSetting])

  return null
}


