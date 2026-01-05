import { api } from './api';

// Types for Country Service
interface CountryOption {
    name: string;
    code: string;
    flag: string;
}

interface CountriesResponse {
    status: boolean;
    message: string;
    data: {
        countries: CountryOption[];
    };
}

export const countryService = {
    // Method for Contact Us form submission
    contactUs: async (data: { name: string; email: string; message: string }) => {
        try {
            const response = await api.post<{ status: boolean; message: string }>('/contact-us', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Method for fetching countries
    getCountries: async () => {
        try {
            const response = await api.get<CountriesResponse>('/countries');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
