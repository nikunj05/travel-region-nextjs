'use client'
import { useEffect } from 'react'

interface LocaleHydratorProps {
  locale: string
}

const LocaleHydrator = ({ locale }: LocaleHydratorProps) => {
  useEffect(() => {
    // Store the locale in localStorage for API requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', locale)
    }
  }, [locale])

  return null // This component doesn't render anything
}

export default LocaleHydrator
