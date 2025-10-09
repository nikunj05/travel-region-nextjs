import * as yup from 'yup';

export const createRegisterSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return yup.object({
    first_name: yup
      .string()
      .required(t('firstNameRequired')),
    last_name: yup
      .string()
      .required(t('lastNameRequired')),
    email: yup
      .string()
      .email(t('emailInvalid'))
      .required(t('emailRequired')),
    country_code: yup
      .string()
      .required(t('countryCodeRequired'))
      .matches(/^\d{1,4}$/, t('countryCodeInvalid')),
    mobile: yup
      .string()
      .required(t('mobileRequired'))
      .matches(/^\d{8,15}$/, t('mobileInvalid')),
    password: yup
      .string()
      .min(6, t('passwordMinLength', { min: 6 }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z]).*$/,
        t('passwordUpperLower')
      )
      .required(t('passwordRequired')),
  });
};

// Keep the default schema for backward compatibility
export const registerSchema = createRegisterSchema((key) => {
  const messages: Record<string, string> = {
    firstNameRequired: 'First name field is required.',
    lastNameRequired: 'Last name field is required.',
    emailInvalid: 'Please enter a valid email address',
    emailRequired: 'Email is required',
    countryCodeRequired: 'Country code field is required.',
    countryCodeInvalid: 'Please select a valid country code',
    mobileRequired: 'Mobile number is required',
    mobileInvalid: 'Mobile number must be 8 to 15 digits',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordUpperLower: 'The password field must contain at least one uppercase and one lowercase letter.',
    passwordRequired: 'Password is required',
  };
  return messages[key] || key;
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
