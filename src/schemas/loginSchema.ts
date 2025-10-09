import * as yup from 'yup';

export const createLoginSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return yup.object({
    email: yup
      .string()
      .email(t('emailInvalid'))
      .required(t('emailRequired')),
    password: yup
      .string()
      .min(6, t('passwordMinLength', { min: 6 }))
      .required(t('passwordRequired')),
  });
};

// Keep the default schema for backward compatibility
export const loginSchema = createLoginSchema((key) => {
  const messages: Record<string, string> = {
    emailInvalid: 'Please enter a valid email address',
    emailRequired: 'Email is required',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordRequired: 'Password is required',
  };
  return messages[key] || key;
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
