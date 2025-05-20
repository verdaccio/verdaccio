import { Button, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import SecurityLayout from '../../layouts/Security/Dialog';
import { Dispatch, RootState } from '../../store';
import LoginError from './LoginError';
import { MessageType } from './Success';
import { SecurityContainer, SecurityForm, SecurityTextField } from './styles';
import { getSecurityUrlParams, validateCredentials } from './utils';

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<Dispatch>();
  const changePasswordStore = useSelector((state: RootState) => state.changePassword);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const { user } = getSecurityUrlParams(location);

  const [username, setUsername] = React.useState(user);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordMismatch, setPasswordMismatch] = React.useState(false);

  useEffect(() => {
    if (username) {
      passwordRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch.changePassword.clearError();
    setPasswordMismatch(false);

    if (!validateCredentials(username, oldPassword, t, dispatch.changePassword.addError)) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      dispatch.changePassword.addError({
        type: 'error',
        description: t('security.error.password-mismatch'),
      });
      return;
    }

    await dispatch.changePassword.updatePassword({
      username,
      oldPassword,
      newPassword,
      messageType: MessageType.ChangePassword,
    });
  };

  return (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm component="form" onSubmit={handleSubmit}>
          <Typography align="center" component="h1" gutterBottom={true} variant="h4">
            {t('security.changePassword.title')}
          </Typography>
          <SecurityTextField
            error={!!changePasswordStore.error}
            inputRef={usernameRef}
            label={t('security.changePassword.username')}
            onChange={(e) => setUsername(e.target.value)}
            required={true}
            value={username}
          />
          <SecurityTextField
            error={!!changePasswordStore.error}
            inputRef={passwordRef}
            label={t('security.changePassword.oldPassword')}
            onChange={(e) => setOldPassword(e.target.value)}
            required={true}
            type="password"
            value={oldPassword}
          />
          <SecurityTextField
            error={!!changePasswordStore.error || passwordMismatch}
            label={t('security.changePassword.newPassword')}
            onChange={(e) => setNewPassword(e.target.value)}
            required={true}
            type="password"
            value={newPassword}
          />
          <SecurityTextField
            error={!!changePasswordStore.error || passwordMismatch}
            label={t('security.changePassword.confirmPassword')}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={true}
            type="password"
            value={confirmPassword}
          />
          {changePasswordStore.error && <LoginError error={changePasswordStore.error} />}
          <Button color="primary" fullWidth={true} sx={{ mt: 2 }} type="submit" variant="contained">
            {t('security.changePassword.submit')}
          </Button>
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  );
};

export default ChangePassword;
