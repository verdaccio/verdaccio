import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import React from 'react';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../';
import { getConfiguration } from '../../configuration';
import { Route } from '../../utils';
import LoginDialogFormError from '../LoginDialog/LoginDialogFormError';
import PasswordField from './PasswordField';
import UsernameField from './UsernameField';

const StyledForm = styled('form')<{ theme?: Theme }>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)<{ theme?: Theme }>(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export interface LoginFormValues {
  username: string;
  password: string;
}

interface Props {
  register: UseFormRegister<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => void;
  errors: FieldErrors<LoginFormValues>;
  isValid: boolean;
}

const LoginForm: FC<Props> = ({ register, handleSubmit, onSubmit, errors, isValid }) => {
  const { t } = useTranslation();
  const configuration = getConfiguration();
  const changePasswordEnabled = configuration?.flags?.changePassword;

  return (
    <StyledForm noValidate={true} onSubmit={handleSubmit(onSubmit)}>
      <UsernameField errors={errors} register={register} />
      <PasswordField errors={errors} register={register} />

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
      {changePasswordEnabled && (
        <Typography align="center" sx={{ mt: 2, fontSize: 12 }} variant="body2">
          <Link href={Route.CHANGE_PASSWORD} sx={{ ml: 1 }}>
            {t('security.changePassword.title')}
          </Link>
        </Typography>
      )}
    </StyledForm>
  );
};

export default LoginForm;
