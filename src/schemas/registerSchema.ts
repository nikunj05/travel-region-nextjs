import * as yup from 'yup';

export const registerSchema = yup.object({
  first_name: yup
    .string()
    .required('First name field is required.')
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name field is required.')
    .min(2, 'Last name must be at least 2 characters'),
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
    .matches(/^[\d\s-()]+$/, 'Please enter a valid mobile number'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
