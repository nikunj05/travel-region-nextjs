export interface PopularDestinationItem {
  id: number;
  location: string;
  image: string;
  full_image_url: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  hotel_count: number;
  hotel_min_price: string; // API returns string, format on render
}

export interface GetPopularDestinationsResponse {
  status: boolean;
  message: string;
  data: {
    destinations: PopularDestinationItem[];
  };
}


