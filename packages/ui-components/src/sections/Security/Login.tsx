import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useDataMutation } from '../../api/use-data-mutation';
import type { LoginFormValues } from '../../components/LoginForm/Login';
import LoginForm from '../../components/LoginForm/Login';
import LoginFormHeader from '../../components/LoginForm/styles';
import NotFound from '../../components/NotFound';
import { getConfiguration } from '../../configuration';
import SecurityLayout from '../../layouts/Security/Dialog';
import type { LoginBody } from '../../providers/AuthProvider/types';
import { normalizeAuthError } from '../../providers/AuthProvider/utils';
import { saveAuth } from '../../store/storage';
import { stripTrailingSlash } from '../../store/utils';
import { Route } from '../../utils';
import { loginSchema } from '../../utils/schemas';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm } from './styles';
import { getSecurityUrlParams } from './utils';

const configuration = getConfiguration();
const basePath = stripTrailingSlash(configuration.base);

const Login: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { next } = getSecurityUrlParams(location);
  const createUserEnabled = configuration?.flags?.createUser;
  const addUserLink = Route.ADD_USER + (next ? '?next=' + next : '');

  const { data, isMutating, trigger } = useDataMutation<LoginBody>(basePath, next, 'POST');

  const form = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  const {
    setError,
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = form;

  const handleLogin = async (body: { username: string; password: string }) => {
    try {
      await trigger(body);
    } catch (err) {
      throw normalizeAuthError(err);
    }
  };

  const onSuccess = useCallback(() => {
    navigate(`${Route.SUCCESS}?messageType=${MessageType.Login}`);
  }, [navigate]);

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      try {
        await handleLogin?.(data);
        onSuccess();
      } catch {
        setError('root', {
          type: 'server',
          // TODO: add translation key
          message: 'Invalid username or password',
        });
      }
    },
    [handleLogin, setError, onSuccess]
  );

  useEffect(() => {
    if (data && !isMutating && data.username && data.token) {
      saveAuth(data.username, data.token);
    }
  }, [data, isMutating]);

  return !next ? (
    <NotFound />
  ) : (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm>
          <LoginFormHeader />
          <LoginForm
            errors={errors}
            handleSubmit={handleSubmit}
            isValid={isValid}
            onSubmit={onSubmit}
            register={register}
          />
          {createUserEnabled && (
            <Typography align="center" sx={{ mt: 2, fontSize: 12 }} variant="body2">
              {t('security.login.noUserQuestion')}
              <Link href={addUserLink} sx={{ ml: 1 }}>
                {t('security.login.createUser')}
              </Link>
            </Typography>
          )}
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  );
};

export default Login;
