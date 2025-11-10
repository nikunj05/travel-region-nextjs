'use client';

import { authService } from '@/services/authService';
import { deleteCookie, setCookie } from 'cookies-next';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { LoginRequest, RegisterRequest, AuthUser, LoginResponse, RegisterResponse } from '@/types';
import {  signOut } from "next-auth/react";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  socialLogin: (data: {
    first_name: string;
    last_name: string;
    email: string;
    social_media_id: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken) {
          setToken(storedToken);
        }
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isClient]);

  const login = async (data: LoginRequest) => {
    try {
      const response: LoginResponse = await authService.login(data);
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      const { token, user: userData } = response.data;
      
      setToken(token);
      setUser(userData);
      if (isClient) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setCookie('token', token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      console.log('AuthContext register called with data:', data);
      
      const response: RegisterResponse = await authService.register(data);
      
      // console.log('Register service response:', response);
      
      // Note: Register response doesn't include token, user needs to login after registration
      // You might want to automatically login after registration or redirect to login page
      console.log('Registration successful, user created:', response.data.user);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  const socialLogin = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    social_media_id: string;
  }) => {
    try {
      const response: LoginResponse = await authService.socialAuth(data);
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      if (isClient) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setCookie('token', newToken);
      }
    } catch (error) {
      console.error('Social login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setToken(null);
      setUser(null);
      if (isClient) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        deleteCookie('token');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isInitialized,
        login,
        register,
        logout,
        setUser,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};