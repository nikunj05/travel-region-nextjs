export interface PopularDestinationItem {
  id: number;
  code: string;
  location: string;
  image: string;
  full_image_url: string;
  hotel_count: number;
  hotel_min_price: string;
}

export interface GetPopularDestinationsResponse {
  status: boolean;
  message: string;
  data: {
    destinations: PopularDestinationItem[];
  };
}


