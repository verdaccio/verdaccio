/* eslint-disable verdaccio/jsx-spread */
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoginError, TextField, Theme } from '../../';
import LoginDialogFormError from './LoginDialogFormError';

const StyledForm = styled('form')<{ theme?: Theme }>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)<{ theme?: Theme }>(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export interface FormValues {
  username: string;
  password: string;
}

interface Props {
  onSubmit: (formValues: FormValues) => void;
  error?: LoginError;
}

const LoginDialogForm = memo(({ onSubmit, error }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({ mode: 'onChange' });

  const onSubmitForm = (formValues: FormValues) => {
    onSubmit(formValues);
  };

  return (
    <StyledForm noValidate={true} onSubmit={handleSubmit(onSubmitForm)}>
      <TextField
        autoComplete="username"
        error={!!errors.username}
        fullWidth={true}
        helperText={errors.username?.message}
        id="login--dialog-username"
        {...register('username', {
          required: { value: true, message: t('form-validation.required-field') },
        })}
        label={t('form.username')}
        margin="normal"
        name="username"
        placeholder={t('form-placeholder.username')}
        required={true}
        variant="outlined"
      />
      <TextField
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
        margin="normal"
        name="password"
        placeholder={t('form-placeholder.password')}
        required={true}
        type="password"
        variant="outlined"
      />
      {error && <LoginDialogFormError error={error} />}
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
});

export default LoginDialogForm;
