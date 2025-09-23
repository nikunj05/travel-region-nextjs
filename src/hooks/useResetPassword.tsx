'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { ResetPasswordFormData } from '@/schemas/resetPasswordSchema';
import { authService } from '@/services/authService';

function extractTokenFromPath(pathname: string): string | null {
  if (!pathname) return null;
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.lastIndexOf('reset-password');
  if (idx >= 0 && segments[idx + 1]) {
    return segments[idx + 1];
  }
  return null;
}

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialEmail = searchParams?.get('email') || '';
  const tokenFromQuery = searchParams?.get('token') || '';
  const tokenFromPath = useMemo(() => extractTokenFromPath(pathname || ''), [pathname]) || '';
  const initialToken = tokenFromQuery || tokenFromPath || '';
// console.log("==>" , initialToken , tokenFromQuery , tokenFromPath);
  useEffect(() => {
    // Surface a gentle hint if token missing
    if (!initialToken) {
      // Not throwing; user may paste it manually
      toast.info('Missing token in reset password link');
    }
  }, [initialToken]);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = initialToken || data.token;
      if (!token) {
        throw new Error('Reset token missing. Please use the link sent to your email.');
      }
      const response = await authService.resetPassword({
        email: data.email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      const message = (response as any)?.message || 'Password reset successful';
      toast.success(message);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Password reset failed';
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
    initialEmail,
    initialToken,
  };
};


