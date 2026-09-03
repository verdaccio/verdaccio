import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Link, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useDataMutation } from '../../api/use-data-mutation';
import LoginDialogFormError from '../../components/LoginDialog/LoginDialogFormError';
import PasswordField from '../../components/LoginForm/PasswordField';
import UsernameField from '../../components/LoginForm/UsernameField';
import { getConfiguration } from '../../configuration';
import SecurityLayout from '../../layouts/Security/Dialog';
import { normalizeAuthError } from '../../providers/AuthProvider/utils';
import { saveAuth } from '../../store/storage';
import { stripTrailingSlash } from '../../store/utils';
import { Route } from '../../utils';
import { APIRoute } from '../../utils/routes';
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
    formState: { isValid, errors },
  } = form;

  const { trigger } = useDataMutation<{ token?: string; username?: string }>(
    basePath,
    APIRoute.SIGNUP,
    'PUT'
  );

  const handleAddUser = useCallback(
    async (body: AddUserBody) => {
      try {
        return await trigger(body);
      } catch (err) {
        throw normalizeAuthError(err);
      }
    },
    [trigger]
  );

  const onSubmit = useCallback(
    async (data: AddUserFormValues) => {
      try {
        const result = await handleAddUser({
          name: data.username,
          password: data.password,
          email: data.email,
          sessionId: crypto.randomUUID(),
        });
        if (result && result.username && result.token) {
          saveAuth(result.username, result.token);
        }
        navigate(`${Route.SUCCESS}?messageType=${MessageType.AddUser}`);
      } catch {
        setError('root', {
          type: 'server',
          // TODO: add translation key
          message: 'Failed to create user',
        });
      }
    },
    [handleAddUser, setError, navigate]
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
            disabled={!isValid}
            fullWidth={true}
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
          >
            {t('security.addUser.submit')}
          </Button>
          <Typography align="center" sx={{ mt: 2, fontSize: 12 }} variant="body2">
            {t('security.addUser.alreadyUserQuestion')}
            <Link href={loginLink} sx={{ ml: 1 }}>
              {t('security.addUser.login')}
            </Link>
          </Typography>
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  ) : null;
};

export default AddUser;
