import * as yup from 'yup';

export const registerSchema = yup.object({
  first_name: yup
    .string()
    .required('First name field is required.'),
  last_name: yup
    .string()
    .required('Last name field is required.'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  country_code: yup
    .string()
    .required('Country code field is required.')
    .matches(/^\d{1,4}$/, 'Please select a valid country code'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d{8,15}$/, 'Mobile number must be 8 to 15 digits'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z]).*$/,
      'The password field must contain at least one uppercase and one lowercase letter.'
    )
    .required('Password is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
