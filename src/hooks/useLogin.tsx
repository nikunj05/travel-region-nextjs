'use client';

import { useState } from 'react';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData } from '@/schemas/loginSchema';

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
      // TODO: Uncomment when API is ready
      // await login(data);
      
      // Mock login for now - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use AuthContext login function (it will handle token generation)
      await login(data);
      
      console.log('Mock login successful');
      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      setError(t('failed'));
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
