'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18/navigation';
import { useEffect, ReactNode } from 'react';

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default PrivateLayout;
