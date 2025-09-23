import { User } from './user';

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register Request
export interface RegisterRequest {
  email: string;
  mobile: string;
  password: string;
  first_name?: string;
  last_name?: string;
  country_code?: string;
}

// Login Response
export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Register Response
export interface RegisterResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
  };
}

// Reset Password Request
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

// Reset Password Response
export interface ResetPasswordResponse {
  status: boolean;
  message: string;
}

// Auth Error Response
export interface AuthErrorResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Context Types
export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  country_code: string;
  address?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  passport_number?: string | null;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}
