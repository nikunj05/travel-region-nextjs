'use client';

import { authService } from '@/services/authService';
import { deleteCookie, setCookie } from 'cookies-next';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (data: any) => {
    try {
      // TODO: Uncomment when API is ready
      // const { token } = await authService.login(data);
      
      // Mock login for now
      const token = data.token || 'mock-jwt-token-' + Date.now();
      
      setToken(token);
      localStorage.setItem('token', token);
      setCookie('token', token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    await authService.register(data);
  };

  const logout = async () => {
    try {
      // await authService.logout();
      setToken(null);
      localStorage.removeItem('token');
      deleteCookie('token');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: true,
        // isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};