export type NewsletterFrequency = 'daily' | 'twice_a_week' | 'weekly' | 'monthly' | 'never';

export interface NotificationPreferences {
  id?: number;
  user_id: number;
  newsletter: NewsletterFrequency;
  travel_blog: number | string;
  special_offers: number | string;
  created_at: string;
  updated_at: string;
}

export interface GetNotificationPreferencesResponse {
  status: boolean;
  message: string;
  data: {
    preferences: NotificationPreferences | null;
  };
}

export interface UpdateNotificationPreferencesRequest {
  newsletter?: NewsletterFrequency;
  travel_blog?: number | string;
  special_offers?: number | string;
}

export interface UpdateNotificationPreferencesResponse {
  status: boolean;
  message: string;
  data: {
    preferences: NotificationPreferences;
  };
}
