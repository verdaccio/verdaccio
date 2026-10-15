import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useDataMutation } from '../../api/use-data-mutation';
import LoginDialog from '../../components/LoginDialog/LoginDialog';
import LoginDialogFormError from '../../components/LoginDialog/LoginDialogFormError';
import { getConfiguration } from '../../configuration';
import SecurityLayout from '../../layouts/Security/Dialog';
import { useAuth } from '../../providers/AuthProvider';
import { authErrorMessage } from '../../providers/AuthProvider/utils';
import { CustomError } from '../../store/api';
import { clearAuth } from '../../store/storage';
import { stripTrailingSlash } from '../../store/utils';
import { Route } from '../../utils';
import { APIRoute } from '../../utils/routes';
import type { ChangePasswordFormValues } from '../../utils/schemas';
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MIN_LENGTH,
  changePasswordSchema,
} from '../../utils/schemas';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm, SecurityTextField } from './styles';

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const configuration = getConfiguration();
  const changePasswordEnabled = configuration?.flags?.changePassword;

  const { userState } = useAuth();

  useEffect(() => {
    if (!changePasswordEnabled) {
      navigate('/');
    }
  }, [changePasswordEnabled, navigate]);

  if (!changePasswordEnabled) {
    return null;
  }

  if (!userState?.token) {
    return (
      <LoginDialog
        message={t('security.changePassword.loginRequired')}
        onClose={() => navigate(Route.ROOT)}
        open={true}
      />
    );
  }

  return <ChangePasswordForm />;
};

const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserState } = useAuth();
  const basePath = stripTrailingSlash(getConfiguration().base);
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
    formState: { isValid, isSubmitting, errors },
  } = form;

  const { trigger } = useDataMutation<{ ok: string }>(basePath, APIRoute.RESET_PASSWORD, 'PUT');

  const handleChangePassword = useCallback(
    async (body: { password: { old: string; new: string } }) => {
      await trigger(body);
    },
    [trigger]
  );

  // `disabled={isSubmitting}` only applies after a re-render; clicks landing in
  // the same React batch would still fire duplicate requests
  const inFlight = useRef(false);

  const onSubmit = useCallback(
    async (data: ChangePasswordFormValues) => {
      if (inFlight.current) {
        return;
      }
      inFlight.current = true;
      try {
        await handleChangePassword({
          password: {
            old: data.oldPassword,
            new: data.newPassword,
          },
        });
        navigate(`${Route.SUCCESS}?messageType=${MessageType.ChangePassword}`);
      } catch (err) {
        if (err instanceof CustomError && err.code === 401) {
          clearAuth();
          setUserState?.({ username: null, token: null });
          return;
        }
        setError('root', {
          type: 'server',
          message: authErrorMessage(err, t('security.error.unable-to-change-password')),
        });
      } finally {
        inFlight.current = false;
      }
    },
    [handleChangePassword, setError, setUserState, navigate, t]
  );

  return (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm onSubmit={handleSubmit(onSubmit)}>
          <Typography align="center" component="h1" gutterBottom={true} variant="h4">
            {t('security.changePassword.title')}
          </Typography>
          <SecurityTextField
            error={!!errors.username}
            helperText={
              errors.username?.message
                ? t(errors.username.message, { length: USERNAME_MIN_LENGTH })
                : undefined
            }
            label={t('security.changePassword.username')}
            {...register('username')}
            required={true}
          />
          <SecurityTextField
            error={!!errors.oldPassword}
            helperText={
              errors.oldPassword?.message
                ? t(errors.oldPassword.message, { length: PASSWORD_MIN_LENGTH })
                : undefined
            }
            label={t('security.changePassword.oldPassword')}
            {...register('oldPassword')}
            required={true}
            type="password"
          />
          <SecurityTextField
            error={!!errors.newPassword}
            helperText={
              errors.newPassword?.message
                ? t(errors.newPassword.message, { length: PASSWORD_MIN_LENGTH })
                : undefined
            }
            label={t('security.changePassword.newPassword')}
            {...register('newPassword')}
            required={true}
            type="password"
          />
          <SecurityTextField
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined
            }
            label={t('security.changePassword.confirmPassword')}
            {...register('confirmPassword')}
            required={true}
            type="password"
          />
          {errors.root && <LoginDialogFormError error={errors.root} />}
          <Button
            color="primary"
            disabled={!isValid || isSubmitting}
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
  );
};

export default ChangePassword;
