import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid mobile number'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
