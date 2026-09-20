import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Typography } from '@mui/material';
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router';

import { useDataMutation } from '../../api/use-data-mutation';
import type { LoginFormValues } from '../../components/LoginForm/Login';
import LoginForm from '../../components/LoginForm/Login';
import LoginFormHeader from '../../components/LoginForm/styles';
import NotFound from '../../components/NotFound';
import { getConfiguration } from '../../configuration';
import SecurityLayout from '../../layouts/Security/Dialog';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import type { LoginBody } from '../../providers/AuthProvider/types';
import { authErrorMessage } from '../../providers/AuthProvider/utils';
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
  const { setUserState } = useAuth();
  const { next } = getSecurityUrlParams(location);
  const createUserEnabled = configuration?.flags?.createUser;
  const addUserLink = Route.ADD_USER + (next ? '?next=' + next : '');

  const { trigger } = useDataMutation<LoginBody>(basePath, next, 'POST');

  const form = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  const {
    setError,
    handleSubmit,
    register,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const handleLogin = useCallback(
    async (body: { username: string; password: string }) => {
      return await trigger(body);
    },
    [trigger]
  );

  const onSuccess = useCallback(() => {
    navigate(`${Route.SUCCESS}?messageType=${MessageType.Login}`);
  }, [navigate]);

  // `disabled={isSubmitting}` only applies after a re-render; clicks landing in
  // the same React batch would still fire duplicate requests
  const inFlight = useRef(false);

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      if (inFlight.current) {
        return;
      }
      inFlight.current = true;
      try {
        const result = await handleLogin?.(data);
        if (!result || !result.username || !result.token) {
          // a 2xx with an unexpected body must not pass as a successful login
          throw new Error('login response is missing the token');
        }
        saveAuth(result.username, result.token);
        // AuthProvider reads storage only once, so the header needs the state update
        setUserState?.({ username: result.username, token: result.token });
        onSuccess();
      } catch (err: any) {
        // only a 401 means wrong credentials; a dead server, 500 or 429 must
        // not claim the credentials were invalid
        const message =
          err?.code === 401
            ? t('security.error.invalid-credentials')
            : authErrorMessage(err, t('security.error.unable-to-login'));
        setError('root', { type: 'server', message });
      } finally {
        inFlight.current = false;
      }
    },
    [handleLogin, setError, setUserState, onSuccess, t]
  );

  return !next ? (
    <NotFound />
  ) : (
    <SecurityLayout>
      <SecurityContainer>
        {/* container only: LoginForm renders the real <form>, and a <form>
            cannot be a descendant of another <form> */}
        <SecurityForm as="div">
          <LoginFormHeader />
          <LoginForm
            errors={errors}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={isValid}
            onSubmit={onSubmit}
            register={register}
          />
          {createUserEnabled && (
            <Typography align="center" sx={{ mt: 2, fontSize: 12 }} variant="body2">
              {t('security.login.noUserQuestion')}
              <Link component={RouterLink} sx={{ ml: 1 }} to={addUserLink}>
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
