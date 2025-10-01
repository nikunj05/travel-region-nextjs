export interface CmsContentLocaleMap {
  en: string;
  ar: string;
}

export interface WhyWeExistItem {
  title: string;
  description: string;
  icon: string | null;
  icon_url: string | null;
}

export interface FewHighlightsItem {
  title: string;
  description: string;
  icon: string | null;
  icon_url: string | null;
}

export interface CmsPageItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  about_us: boolean;
  founder_image: string | null;
  founder_image_url: string | null;
  why_we_exist: WhyWeExistItem[] | null;
  our_partners: string[] | null;
  few_highlights: FewHighlightsItem[] | null;
  ready_to_explore_title: string | null;
  ready_to_explore_sub_title: string | null;
  ready_to_explore_image: string | null;
  ready_to_explore_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetCmsPagesResponse {
  status: boolean;
  message: string;
  data: {
    content: CmsPageItem[];
  };
}

export interface GetCmsPageDetailResponse {
  status: boolean;
  message: string;
  data: {
    content: CmsPageItem;
  };
}


