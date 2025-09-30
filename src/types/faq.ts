export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: number;
  name: string;
  faqs: FaqItem[];
}

export interface GetFaqsResponse {
  status: boolean;
  message: string;
  data: {
    faqs: FaqCategory[];
  };
}


