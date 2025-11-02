/* eslint-disable verdaccio/jsx-spread */
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Theme } from '../../';
import { useAuth } from '../../providers/AuthProvider';
import LoginDialogFormError from './LoginDialogFormError';

const schema = yup
  .object()
  .shape({
    // TODO: config via __VERDACCIO_BASENAME_UI_OPTIONS
    username: yup.string().min(2).required(),
    // TODO: config via __VERDACCIO_BASENAME_UI_OPTIONS
    password: yup.string().min(2).required(),
  })
  .required();

const StyledForm = styled('form')<{ theme?: Theme }>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)<{ theme?: Theme }>(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const StyledTextField = styled(TextField)<{ theme?: Theme }>(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export type FormValues = yup.InferType<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

const LoginDialogForm: FC<Props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { handleLogin, userState } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleDoLogin = useCallback(
    async (data: FormValues) => {
      try {
        await handleLogin?.({ username: data.username, password: data.password });
        onSuccess?.();
      } catch (error) {
        console.error('Login error:', error);
        setError('root', {
          type: 'server',
          message: 'Invalid username or password',
        });
      }
    },
    [handleLogin]
  );

  return (
    <StyledForm noValidate={true} onSubmit={handleSubmit(handleDoLogin)}>
      <StyledTextField
        autoComplete="username"
        error={!!errors.username}
        fullWidth={true}
        helperText={errors.username?.message}
        id="login--dialog-username"
        {...register('username', {
          required: { value: true, message: t('form-validation.required-field') },
        })}
        label={t('form.username')}
        name="username"
        placeholder={t('form-placeholder.username')}
        required={true}
        variant="outlined"
      />
      <StyledTextField
        autoComplete="current-password"
        error={!!errors.password}
        fullWidth={true}
        helperText={errors.password?.message}
        id="login--dialog-password"
        {...register('password', {
          required: { value: true, message: t('form-validation.required-field') },
        })}
        data-testid="password"
        label={t('form.password')}
        name="password"
        placeholder={t('form-placeholder.password')}
        required={true}
        type="password"
        variant="outlined"
      />
      {errors.root && <LoginDialogFormError error={errors.root} />}
      <StyledButton
        color="primary"
        data-testid="login-dialog-form-login-button"
        disabled={!isValid}
        fullWidth={true}
        id="login--dialog-button-submit"
        size="large"
        type="submit"
        variant="contained"
      >
        {t('button.login')}
      </StyledButton>
    </StyledForm>
  );
};

export default LoginDialogForm;
