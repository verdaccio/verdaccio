import * as yup from 'yup';

export const USERNAME_MIN_LENGTH = 2;

// Matches your current logic
export const usernameSchema = yup
  .string()
  .required()
  .min(USERNAME_MIN_LENGTH)
  .matches(/^[-a-zA-Z0-9_.!~*'()@]+$/, 'security.error.username-must-be-url-safe');

export const passwordSchema = yup.string().required().min(2);

export const loginSchema = yup.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const addUserSchema = yup.object({
  username: usernameSchema,
  password: passwordSchema,
  email: yup.string().email().required(),
});

export type AddUserFormValues = yup.InferType<typeof addUserSchema>;

export const changePasswordSchema = yup.object({
  username: usernameSchema,
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'security.error.password-mismatch'),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;
