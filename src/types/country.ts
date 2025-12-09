export interface Country {
  name: string;
  code: string;
  flag: string; // Emoji flag
}

export interface CountriesResponse {
  data: {
    countries: Country[];
  };
}

