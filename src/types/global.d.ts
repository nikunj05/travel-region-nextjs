import { routing } from '@/i18/routing';

declare global {
  // Use type-safe message keys with `next-intl`
  interface IntlMessages {
    // Add your message keys here as you define them
  }
}

declare module 'next-intl' {
  type Locale = typeof routing.locales[number];
}

export {};
