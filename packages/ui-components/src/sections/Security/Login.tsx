import { Button, Link, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import SecurityLayout from '../../layouts/Security/Dialog';
import { Route } from '../../utils';
import LoginError from './LoginError';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm, SecurityTextField } from './styles';
import { getSecurityUrlParams, validateCredentials } from './utils';

const Login: React.FC = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch<Dispatch>();
  // const loginStore = useSelector((state: RootState) => state.loginV1);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const { next, user } = getSecurityUrlParams(location);
  const addUserLink = Route.ADD_USER + (next ? '?next=' + next : '');

  const [username, setUsername] = React.useState(user);
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (username) {
      passwordRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch.loginV1.clearError();

    // if (!validateCredentials(username, password)) {
    //   return;
    // }

    // await dispatch.loginV1.login({
    //   username,
    //   password,
    //   next,
    //   messageType: MessageType.Login,
    // });
  };

  return (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm component="form" onSubmit={handleSubmit}>
          <Typography align="center" component="h1" gutterBottom={true} variant="h4">
            {t('security.login.title')}
          </Typography>
          <SecurityTextField
            error={false}
            inputRef={usernameRef}
            label={t('security.login.username')}
            onChange={(e) => setUsername(e.target.value)}
            required={true}
            value={username}
          />
          <SecurityTextField
            error={false}
            inputRef={passwordRef}
            label={t('security.login.password')}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            type="password"
            value={password}
          />
          {/* {true && <LoginError error={{}} />} */}
          <Button color="primary" fullWidth={true} sx={{ mt: 2 }} type="submit" variant="contained">
            {t('security.login.submit')}
          </Button>
          <Typography align="center" sx={{ mt: 2, fontSize: 12 }} variant="body2">
            {t('security.login.noUserQuestion')}
            <Link href={addUserLink} sx={{ ml: 1 }}>
              {t('security.login.createUser')}
            </Link>
          </Typography>
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  );
};

export default Login;
