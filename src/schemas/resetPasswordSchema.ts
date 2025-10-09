import * as yup from 'yup';

export const createResetPasswordSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return yup.object({
    email: yup
      .string()
      .email(t('emailInvalid'))
      .required(t('emailRequired')),
    token: yup
      .string()
      .optional(),
    password: yup
      .string()
      .min(8, t('passwordMinLength', { min: 8 }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        t('passwordComplex')
      )
      .required(t('passwordRequired')),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('passwordsMatch'))
      .required(t('confirmPasswordRequired')),
  });
};

// Keep the default schema for backward compatibility
export const resetPasswordSchema = createResetPasswordSchema((key) => {
  const messages: Record<string, string> = {
    emailInvalid: 'Please enter a valid email address',
    emailRequired: 'Email is required',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordComplex: 'Password must include upper, lower, number, and symbol',
    passwordRequired: 'Password is required',
    passwordsMatch: 'Passwords must match',
    confirmPasswordRequired: 'Confirm password is required',
  };
  return messages[key] || key;
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;


