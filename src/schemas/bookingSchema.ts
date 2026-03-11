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
  guests: GuestFormData[];
  specialRequests?: string;
}

const phoneRegex = /^[0-9]{7,15}$/;
// RegEx for English characters only (A-Z, a-z, and spaces) - as per Bedsonline API requirements
const englishNameRegex = /^[A-Za-z\s]+$/;

export const createBookingSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  // Guest schema - all fields are required
  const guestSchema = yup.object().shape({
    firstName: yup.string()
      .required(t('firstNameRequired'))
      .matches(englishNameRegex, t('firstNameEnglishOnly')),
    lastName: yup.string()
      .required(t('lastNameRequired'))
      .matches(englishNameRegex, t('lastNameEnglishOnly')),
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
    guests: yup.array().of(guestSchema).required(),
    specialRequests: yup.string().max(500, t('specialRequestsMaxLength', { max: 500 })),
  });
};

