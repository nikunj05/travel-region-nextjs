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
// RegEx for English characters only (A-Z, a-z, and spaces) - as per Bedsonline API requirements
const englishNameRegex = /^[A-Za-z\s]+$/;

export const createBookingSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  // Primary guest schema - all fields are required
  const primaryGuestSchema = yup.object().shape({
    firstName: yup.string()
      .required(t('firstNameRequired'))
      .matches(englishNameRegex, t('firstNameEnglishOnly'))
      .min(2, t('firstNameMinLength', { min: 2 })),
    lastName: yup.string()
      .required(t('lastNameRequired'))
      .matches(englishNameRegex, t('lastNameEnglishOnly'))
      .min(2, t('lastNameMinLength', { min: 2 })),
    email: yup.string()
      .required(t('emailRequired'))
      .email(t('emailInvalid')),
    country: yup.string()
      .required(t('countryRequired')),
    countryCode: yup.string()
      .required(t('countryCodeRequired')),
    phone: yup.string()
      .required(t('phoneRequired'))
      .matches(phoneRegex, t('phoneInvalid')),
  });

  return yup.object().shape({
    primaryGuest: primaryGuestSchema,
    specialRequests: yup.string().max(500, t('specialRequestsMaxLength', { max: 500 })),
  });
};

