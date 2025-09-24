'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { formatApiErrorMessage } from '@/lib/formatApiError';
import { ForgotPasswordFormData } from '@/schemas/forgotPasswordSchema';
import { authService } from '@/services/authService';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword({ email: data.email });
      const successMessage = (response as any)?.message || 'Reset link sent to your email';
      toast.success(successMessage);
    } catch (error: any) {
      const errorMessage = formatApiErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, error };
};


