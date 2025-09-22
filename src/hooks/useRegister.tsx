'use client';

import { useState } from 'react';
import { useRouter } from '@/i18/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData } from '@/schemas/registerSchema';
import { toast } from 'react-toastify';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations('Auth.register');
  const { register } = useAuth();

  const handleSubmit = async (data: RegisterFormData) => {
    console.log('useRegister handleSubmit called with data:', data);
   
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling AuthContext register function...');
      await register(data);
      
      console.log('Register successful, redirecting to login...');
      setSuccess(true);
      toast.success('Registration successful! Redirecting to login...');
      router.push('/login');
    } catch (error) {
      console.error('Register failed:', error);
      const errorMessage = t('failed') || 'Registration failed';
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
    success,
  };
};
