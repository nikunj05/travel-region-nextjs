export interface SocialMediaLink {
  title: string;
  link: string;
  icon: string | null;
}

export interface GradientColorStop {
  color: string;
  position: number;
}

export interface FaqBackgroundColor {
  colors: GradientColorStop[];
  css?: string | null;
  direction?: string | null;
}

export interface AppSetting {
  logo: string;
  favicon: string;
  footer_logo: string;
  copyright: string;
  footer_info: string;
  contact_us: string;
  whatsapp_number: string;
  social_media_links: SocialMediaLink[];
  // Optional homepage hero fields provided by backend
  home_hero_image?: string | null;
  home_title?: string | null;
  home_subtitle?: string | null;
  faq_background_color?: FaqBackgroundColor | null;
}

export interface GetSettingsResponse {
  status: boolean;
  message: string;
  data: {
    setting: AppSetting;
  };
}


