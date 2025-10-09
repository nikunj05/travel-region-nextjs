import * as yup from 'yup';

export const createForgotPasswordSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return yup.object({
    email: yup
      .string()
      .email(t('emailInvalid'))
      .required(t('emailRequired')),
  });
};

// Keep the default schema for backward compatibility
export const forgotPasswordSchema = createForgotPasswordSchema((key) => {
  const messages: Record<string, string> = {
    emailInvalid: 'Please enter a valid email address',
    emailRequired: 'Email is required',
  };
  return messages[key] || key;
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;


