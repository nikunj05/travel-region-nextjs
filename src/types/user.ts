export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  country_code: string;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  passport_number: string | null;
  profile_image: string | null;
  profile_image_url: string | null;
}

// API Response interfaces
export interface ProfileResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  gender: string;
  country_code: string;
  mobile: string;
  date_of_birth: string;
  nationality: string;
  address?: string;
  passport_number?: string;
}

export interface UpdateProfileResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
  };
}

// User Settings interfaces
export interface UserSettings {
  language: string | null;
  currency: string | null;
  email: string;
  country_code: string;
  mobile: string;
  // Home hero content (optional, provided by server settings)
  home_hero_image?: string | null;
  home_title?: string | null;
  home_subtitle?: string | null;
}

export interface UserSettingsResponse {
  status: boolean;
  message: string;
  data: {
    user_settings: UserSettings;
  };
}

export interface UpdateUserSettingsRequest {
  language?: string;
  currency?: string;
  email?: string;
  country_code?: string;
  mobile?: string;
  password?: string;
  // Optional: allow updating homepage hero content if backend supports it
  home_hero_image?: string;
  home_title?: string;
  home_subtitle?: string;
}

export interface UpdateUserSettingsResponse {
  status: boolean;
  message: string;
  data?: string;
}