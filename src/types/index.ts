// Export all types from a single entry point
export * from './user';
export * from './auth';
export * from './settings';

// NextAuth type augmentation
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}