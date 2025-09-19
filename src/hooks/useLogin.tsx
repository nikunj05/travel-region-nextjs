'use client';

import { useState } from 'react';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData } from '@/schemas/loginSchema';
import { toast } from 'react-toastify';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('Auth.login');
  const { login } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data);
      toast.success('Login successful');
      router.push('/profile');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error?.response?.data?.message || error?.message || t('failed');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
};
