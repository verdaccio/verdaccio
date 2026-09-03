import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import type { FC } from 'react';
import React from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../';
import type { AddUserFormValues, LoginFormValues } from '../../utils/schemas';
import { USERNAME_MIN_LENGTH } from '../../utils/schemas';

const StyledTextField = styled(TextField)<{ theme?: Theme }>(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

interface Props {
  register: any;
  errors: FieldErrors<LoginFormValues | AddUserFormValues>;
}

const UsernameField: FC<Props> = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
    <StyledTextField
      autoComplete="username"
      error={!!errors.username}
      fullWidth={true}
      // schema messages are i18n keys (inline rules are ignored when a resolver is set)
      helperText={
        errors.username?.message
          ? t(errors.username.message, { length: USERNAME_MIN_LENGTH })
          : undefined
      }
      id="login--dialog-username"
      {...register('username')}
      label={t('form.username')}
      placeholder={t('form-placeholder.username')}
      required={true}
      variant="outlined"
    />
  );
};

export default UsernameField;
