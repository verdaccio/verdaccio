import styled from '@emotion/styled';
import React, { memo } from 'react';
import useForm from 'react-hook-form/dist/react-hook-form.ie11';
import { useTranslation } from 'react-i18next';

import Button from 'verdaccio-ui/components/Button';
import TextField from 'verdaccio-ui/components/TextField';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { LoginError } from 'verdaccio-ui/utils/login';

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
    errors,
    handleSubmit,
    formState: { isValid },
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
        inputRef={register({
          required: { value: true, message: t('form-validation.required-field') },
          minLength: { value: 2, message: t('form-validation.required-min-length', { length: 2 }) },
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
        inputRef={register({
          required: { value: true, message: t('form-validation.required-field') },
          minLength: { value: 2, message: t('form-validation.required-min-length', { length: 2 }) },
        })}
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
        variant="contained">
        {t('button.login')}
      </StyledButton>
    </StyledForm>
  );
});

export default LoginDialogForm;
