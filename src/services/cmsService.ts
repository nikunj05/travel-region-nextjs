import { api } from './api';
import { GetCmsPagesResponse, GetCmsPageDetailResponse } from '@/types/cms';

export const cmsService = {
  getPages: async (): Promise<GetCmsPagesResponse> => {
    try {
      const response = await api.get<GetCmsPagesResponse>('/pages');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPageBySlug: async (slug: string): Promise<GetCmsPageDetailResponse> => {
    try {
      const response = await api.get<GetCmsPageDetailResponse>(`/pages/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


