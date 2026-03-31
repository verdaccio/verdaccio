import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useDataMutation } from '../../api/use-data-mutation';
import LoginDialogFormError from '../../components/LoginDialog/LoginDialogFormError';
import { getConfiguration } from '../../configuration';
import SecurityLayout from '../../layouts/Security/Dialog';
import { normalizeAuthError } from '../../providers/AuthProvider/utils';
import { stripTrailingSlash } from '../../store/utils';
import { Route } from '../../utils';
import { APIRoute } from '../../utils/routes';
import type { ChangePasswordFormValues } from '../../utils/schemas';
import { changePasswordSchema } from '../../utils/schemas';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm, SecurityTextField } from './styles';

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const configuration = getConfiguration();
  const basePath = stripTrailingSlash(configuration.base);
  const changePasswordEnabled = configuration?.flags?.changePassword;

  const form = useForm<ChangePasswordFormValues>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const {
    setError,
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = form;

  const { trigger } = useDataMutation<{ ok: string }>(basePath, APIRoute.RESET_PASSWORD, 'PUT');

  const handleChangePassword = useCallback(
    async (body: { password: { old: string; new: string } }) => {
      try {
        await trigger(body);
      } catch (err) {
        throw normalizeAuthError(err);
      }
    },
    [trigger]
  );

  const onSubmit = useCallback(
    async (data: ChangePasswordFormValues) => {
      try {
        await handleChangePassword({
          password: {
            old: data.oldPassword,
            new: data.newPassword,
          },
        });
        navigate(`${Route.SUCCESS}?messageType=${MessageType.ChangePassword}`);
      } catch {
        setError('root', {
          type: 'server',
          message: 'Failed to change password',
        });
      }
    },
    [handleChangePassword, setError, navigate]
  );

  useEffect(() => {
    if (!changePasswordEnabled) {
      navigate('/');
    }
  }, [changePasswordEnabled, navigate]);

  return changePasswordEnabled ? (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm onSubmit={handleSubmit(onSubmit)}>
          <Typography align="center" component="h1" gutterBottom={true} variant="h4">
            {t('security.changePassword.title')}
          </Typography>
          <SecurityTextField
            error={!!errors.username}
            helperText={errors.username?.message}
            label={t('security.changePassword.username')}
            {...register('username')}
            required={true}
          />
          <SecurityTextField
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
            label={t('security.changePassword.oldPassword')}
            {...register('oldPassword')}
            required={true}
            type="password"
          />
          <SecurityTextField
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            label={t('security.changePassword.newPassword')}
            {...register('newPassword')}
            required={true}
            type="password"
          />
          <SecurityTextField
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            label={t('security.changePassword.confirmPassword')}
            {...register('confirmPassword')}
            required={true}
            type="password"
          />
          {errors.root && <LoginDialogFormError error={errors.root} />}
          <Button
            color="primary"
            disabled={!isValid}
            fullWidth={true}
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
          >
            {t('security.changePassword.submit')}
          </Button>
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  ) : null;
};

export default ChangePassword;
