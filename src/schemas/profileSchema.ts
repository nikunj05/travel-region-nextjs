import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  
  country_code: yup
    .string()
    .required('Country code is required'),
  
  mobile: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9\s\-\+\(\)]+$/, 'Phone number must be valid'),
  
  date_of_birth: yup
    .string()
    .required('Date of birth is required')
    .test('is-valid-date', 'Please enter a valid date', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test('is-not-future', 'Date of birth cannot be in the future', (value) => {
      if (!value) return false;
      return new Date(value) <= new Date();
    }),
  
  nationality: yup
    .string()
    .required('Nationality is required'),
  
  address: yup
    .string()
    .optional()
    .max(200, 'Address must not exceed 200 characters'),
  
  passport_number: yup
    .string()
    .optional()
    .max(20, 'Passport number must not exceed 20 characters'),
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;

