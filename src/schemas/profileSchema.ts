import * as yup from 'yup';

export const createProfileSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return yup.object().shape({
    first_name: yup
      .string()
      .required(t('firstNameRequired'))
      .min(2, t('firstNameMinLength', { min: 2 }))
      .max(50, t('firstNameMaxLength', { max: 50 })),
    
    last_name: yup
      .string()
      .required(t('lastNameRequired'))
      .min(2, t('lastNameMinLength', { min: 2 }))
      .max(50, t('lastNameMaxLength', { max: 50 })),
    
    gender: yup
      .string()
      .required(t('genderRequired'))
      .oneOf(['male', 'female', 'other'], t('genderInvalid')),
    
    country_code: yup
      .string()
      .required(t('countryCodeRequired')),
    
    mobile: yup
      .string()
      .required(t('phoneRequired'))
      .matches(/^[0-9\s\-\+\(\)]+$/, t('phoneInvalid')),
    
    date_of_birth: yup
      .string()
      .required(t('dateOfBirthRequired'))
      .test('is-valid-date', t('dateOfBirthInvalid'), (value) => {
        if (!value) return false;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      })
      .test('is-not-future', t('dateOfBirthFuture'), (value) => {
        if (!value) return false;
        return new Date(value) <= new Date();
      }),
    
    nationality: yup
      .string()
      .required(t('nationalityRequired')),
    
    address: yup
      .string()
      .optional()
      .max(200, t('addressMaxLength', { max: 200 })),
    
    passport_number: yup
      .string()
      .optional()
      .max(20, t('passportMaxLength', { max: 20 })),
  });
};

// Keep the default schema for backward compatibility
export const profileSchema = createProfileSchema((key) => {
  const messages: Record<string, string> = {
    firstNameRequired: 'First name is required',
    firstNameMinLength: 'First name must be at least 2 characters',
    firstNameMaxLength: 'First name must not exceed 50 characters',
    lastNameRequired: 'Last name is required',
    lastNameMinLength: 'Last name must be at least 2 characters',
    lastNameMaxLength: 'Last name must not exceed 50 characters',
    genderRequired: 'Gender is required',
    genderInvalid: 'Please select a valid gender',
    countryCodeRequired: 'Country code is required',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Phone number must be valid',
    dateOfBirthRequired: 'Date of birth is required',
    dateOfBirthInvalid: 'Please enter a valid date',
    dateOfBirthFuture: 'Date of birth cannot be in the future',
    nationalityRequired: 'Nationality is required',
    addressMaxLength: 'Address must not exceed 200 characters',
    passportMaxLength: 'Passport number must not exceed 20 characters',
  };
  
  return messages[key] || key;
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;

