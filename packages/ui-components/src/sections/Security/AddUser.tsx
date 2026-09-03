import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Link, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router';

import { useDataMutation } from '../../api/use-data-mutation';
import LoginDialogFormError from '../../components/LoginDialog/LoginDialogFormError';
import PasswordField from '../../components/LoginForm/PasswordField';
import UsernameField from '../../components/LoginForm/UsernameField';
import { getConfiguration } from '../../configuration';
import SecurityLayout from '../../layouts/Security/Dialog';
import { authErrorMessage } from '../../providers/AuthProvider/utils';
import { saveAuth } from '../../store/storage';
import { stripTrailingSlash } from '../../store/utils';
import { Route } from '../../utils';
import { APIRoute } from '../../utils/routes';
import { generateSessionId } from '../../utils/session-id';
import type { AddUserFormValues } from '../../utils/schemas';
import { addUserSchema } from '../../utils/schemas';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm, SecurityTextField } from './styles';
import { getSecurityUrlParams } from './utils';

type AddUserBody = {
  name: string;
  password: string;
  email?: string;
  // the signup endpoint rejects requests without a 36-char session id
  sessionId: string;
};

const AddUser: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const configuration = getConfiguration();
  const basePath = stripTrailingSlash(configuration.base);
  const { next, user } = getSecurityUrlParams(location);
  const loginLink = Route.LOGIN + (next ? `?next=${encodeURIComponent(next)}` : '');
  const createUserEnabled = configuration?.flags?.createUser;
  const form = useForm<AddUserFormValues>({
    mode: 'onChange',
    defaultValues: {
      username: typeof user === 'string' ? user : '',
      password: '',
      email: '',
    },
    resolver: yupResolver(addUserSchema),
  });

  const {
    setError,
    handleSubmit,
    register,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const { trigger } = useDataMutation<{ token?: string; username?: string }>(
    basePath,
    APIRoute.SIGNUP,
    'PUT'
  );

  const handleAddUser = useCallback(
    async (body: AddUserBody) => {
      return await trigger(body);
    },
    [trigger]
  );

  // `disabled={isSubmitting}` only applies after a re-render; clicks landing in
  // the same React batch would still fire duplicate requests
  const inFlight = useRef(false);

  const onSubmit = useCallback(
    async (data: AddUserFormValues) => {
      if (inFlight.current) {
        return;
      }
      inFlight.current = true;
      try {
        const result = await handleAddUser({
          name: data.username,
          password: data.password,
          email: data.email,
          sessionId: generateSessionId(),
        });
        if (result && result.username && result.token) {
          saveAuth(result.username, result.token);
        }
        navigate(`${Route.SUCCESS}?messageType=${MessageType.AddUser}`);
      } catch (err) {
        setError('root', {
          type: 'server',
          message: authErrorMessage(err, t('security.error.unable-to-add-user')),
        });
      } finally {
        inFlight.current = false;
      }
    },
    [handleAddUser, setError, navigate, t]
  );

  useEffect(() => {
    if (!createUserEnabled) {
      navigate('/');
    }
  }, [createUserEnabled, navigate]);

  return createUserEnabled ? (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm onSubmit={handleSubmit(onSubmit)}>
          <Typography align="center" component="h1" gutterBottom={true} variant="h4">
            {t('security.addUser.title')}
          </Typography>
          <UsernameField errors={errors} register={register} />
          <PasswordField errors={errors} register={register} />

          <SecurityTextField
            error={!!errors.email}
            // without this the submit button silently stays disabled on an
            // invalid email, with no visible reason
            helperText={errors.email?.message ? t(errors.email.message) : undefined}
            label={t('security.addUser.email')}
            type="email"
            {...register('email')}
          />

          <Typography color="text.secondary" paragraph={true} sx={{ fontSize: 12 }} variant="body2">
            {t('security.addUser.emailDescription')}
          </Typography>
          {errors.root && <LoginDialogFormError error={errors.root} />}
          <Button
            color="primary"
            disabled={!isValid || isSubmitting}
            fullWidth={true}
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
          >
            {t('security.addUser.submit')}
          </Button>
          <Typography align="center" sx={{ mt: 2, fontSize: 12 }} variant="body2">
            {t('security.addUser.alreadyUserQuestion')}
            <Link component={RouterLink} sx={{ ml: 1 }} to={loginLink}>
              {t('security.addUser.login')}
            </Link>
          </Typography>
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  ) : null;
};

export default AddUser;
