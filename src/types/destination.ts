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
}

export interface GetPopularDestinationsResponse {
  status: boolean;
  message: string;
  data: {
    destinations: PopularDestinationItem[];
  };
}


