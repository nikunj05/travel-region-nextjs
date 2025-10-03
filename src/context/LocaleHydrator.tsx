'use client'
import { useEffect } from 'react'

interface LocaleHydratorProps {
  locale: string
}

const LocaleHydrator = ({ locale }: LocaleHydratorProps) => {
  useEffect(() => {
    // Store the locale in localStorage for API requests
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('NEXT_LOCALE', locale)
      } catch (error) {
        console.warn('Failed to store locale in localStorage:', error)
      }
    }
  }, [locale])

  return null // This component doesn't render anything
}

export default LocaleHydrator
