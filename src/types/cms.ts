export interface CmsContentLocaleMap {
  en: string;
  ar: string;
}

export interface CmsPageItem {
  id: number;
  title: string;
  slug: string;
  content: CmsContentLocaleMap;
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


