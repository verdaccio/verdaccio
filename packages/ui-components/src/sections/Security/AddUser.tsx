import { Button, Link, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import SecurityLayout from '../../layouts/Security/Dialog';
import { Dispatch, RootState } from '../../store';
import { Route } from '../../utils';
import LoginError from './LoginError';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm, SecurityTextField } from './styles';
import { getSecurityUrlParams, validateCredentials } from './utils';

const AddUser: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<Dispatch>();
  const addUserStore = useSelector((state: RootState) => state.addUser);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const { next, user } = getSecurityUrlParams(location);
  const loginLink = Route.LOGIN + (next ? '?next=' + next : '');

  const [username, setUsername] = React.useState(user);
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  useEffect(() => {
    if (username) {
      passwordRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch.addUser.clearError();

    if (!validateCredentials(username, password, t, dispatch.addUser.addError)) {
      return;
    }

    await dispatch.addUser.register({
      username: username,
      password,
      email,
      next,
      messageType: MessageType.AddUser,
    });
  };

  return (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm component="form" onSubmit={handleSubmit}>
          <Typography align="center" component="h1" gutterBottom={true} variant="h4">
            {t('security.addUser.title')}
          </Typography>
          <SecurityTextField
            error={!!addUserStore.error}
            inputRef={usernameRef}
            label={t('security.addUser.username')}
            onChange={(e) => setUsername(e.target.value)}
            required={true}
            value={username}
          />
          <SecurityTextField
            error={!!addUserStore.error}
            inputRef={passwordRef}
            label={t('security.addUser.password')}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            type="password"
            value={password}
          />
          <SecurityTextField
            error={!!addUserStore.error}
            label={t('security.addUser.email')}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
          />
          <Typography color="text.secondary" paragraph={true} sx={{ fontSize: 12 }} variant="body2">
            {t('security.addUser.emailDescription')}
          </Typography>
          {addUserStore.error && <LoginError error={addUserStore.error} />}
          <Button color="primary" fullWidth={true} sx={{ mt: 2 }} type="submit" variant="contained">
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
  );
};

export default AddUser;
