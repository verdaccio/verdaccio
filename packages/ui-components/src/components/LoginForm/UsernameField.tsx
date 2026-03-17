import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import type { FC } from 'react';
import React from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../';
import type { AddUserFormValues, LoginFormValues } from '../../utils/schemas';

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
      helperText={errors.username?.message}
      id="login--dialog-username"
      {...register('username', {
        required: { value: true, message: t('form-validation.required-field') },
      })}
      label={t('form.username')}
      placeholder={t('form-placeholder.username')}
      required={true}
      variant="outlined"
    />
  );
};

export default UsernameField;
