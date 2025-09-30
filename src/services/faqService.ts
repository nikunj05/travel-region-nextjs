import { api } from './api';
import { GetFaqsResponse } from '@/types/faq';

export const faqService = {
  getFaqs: async (): Promise<GetFaqsResponse> => {
    try {
      const response = await api.get<GetFaqsResponse>('/faqs');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


