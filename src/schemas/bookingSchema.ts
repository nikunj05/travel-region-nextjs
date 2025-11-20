import * as yup from 'yup';

export interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
}

export interface BookingFormData {
  primaryGuest: GuestFormData;
  specialRequests?: string;
}

const phoneRegex = /^[0-9]{7,15}$/;

// Primary guest schema - all fields are required
const primaryGuestSchema = yup.object().shape({
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  country: yup.string()
    .required('Country is required'),
  countryCode: yup.string()
    .required('Country code is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(phoneRegex, 'Please enter a valid phone number (7-15 digits)'),
});

export const createBookingSchema = () => {
  return yup.object().shape({
    primaryGuest: primaryGuestSchema,
    specialRequests: yup.string().max(500, 'Special requests must not exceed 500 characters'),
  });
};

