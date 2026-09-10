import * as yup from 'yup';

export const USERNAME_MIN_LENGTH = 2;
export const PASSWORD_MIN_LENGTH = 2;

// All messages are i18n keys; the form fields translate them on render with
// t(message, { length }) so they follow the selected language.
export const usernameSchema = yup
  .string()
  .required('form-validation.required-field')
  .min(USERNAME_MIN_LENGTH, 'security.error.username-min-length')
  .matches(/^[-a-zA-Z0-9_.!~*'()@]+$/, 'security.error.username-must-be-url-safe');

export const passwordSchema = yup
  .string()
  .required('form-validation.required-field')
  .min(PASSWORD_MIN_LENGTH, 'form-validation.required-min-length');

export const loginSchema = yup.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const addUserSchema = yup.object({
  username: usernameSchema,
  password: passwordSchema,
  email: yup
    .string()
    .email('form-validation.invalid-email')
    .required('form-validation.required-field'),
});

export type AddUserFormValues = yup.InferType<typeof addUserSchema>;

export const changePasswordSchema = yup.object({
  username: usernameSchema,
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .required('form-validation.required-field')
    .oneOf([yup.ref('newPassword')], 'security.error.password-mismatch'),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;
