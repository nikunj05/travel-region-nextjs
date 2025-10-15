// Export all types from a single entry point
export * from './user';
export * from './auth';
export * from './settings';
export * from './blog';
export * from './cms';
export * from './faq';
export * from './notification';
export * from './favorite';
export * from './testimonial';
export * from './hotel';

// NextAuth type augmentation
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    socialId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}