export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  country_code: string;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  passport_number: string | null;
}

