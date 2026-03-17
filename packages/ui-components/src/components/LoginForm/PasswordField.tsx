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

const PasswordField: FC<Props> = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
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
      placeholder={t('form-placeholder.password')}
      required={true}
      type="password"
      variant="outlined"
    />
  );
};

export default PasswordField;
