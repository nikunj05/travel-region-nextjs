'use client';

import { useState } from 'react';
import { useRouter } from '@/i18/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData } from '@/schemas/registerSchema';
import { toast } from 'react-toastify';
import {  formatApiErrorMessages } from '@/lib/formatApiError';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (data: RegisterFormData) => {
   
    setIsLoading(true);
    setError(null);
    
    try {
      await register(data);
      
      setSuccess(true);
      toast.success('Registration successful! Redirecting to login...');
      router.push('/login');
    } catch (error) {
      console.error('Register failed:', error);
      const errorMessages = formatApiErrorMessages(error);
      const errorMessage = errorMessages.join(' ') ;
      setError(errorMessage);
      
      // Show separate toasts for each error message
      errorMessages.forEach((msg) => {
        toast.error(msg);
      });
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
