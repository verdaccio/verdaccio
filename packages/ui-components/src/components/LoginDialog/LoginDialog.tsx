import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import i18next from 'i18next';
import isEmpty from 'lodash/isEmpty';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, LoginBody, RootState } from '../../';
import LoginDialogCloseButton from './LoginDialogCloseButton';
import LoginDialogForm, { FormValues } from './LoginDialogForm';
import LoginDialogHeader from './LoginDialogHeader';

interface Props {
  open?: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<Props> = ({ onClose, open = false }) => {
  const loginStore: any = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<Dispatch>();
  const makeLogin = useCallback(
    async (username?: string, password?: string): Promise<LoginBody | void> => {
      // checks isEmpty
      if (!username || !password || isEmpty(username) || isEmpty(password)) {
        dispatch.login.addError({
          type: 'error',
          description: i18next.t('form-validation.username-or-password-cant-be-empty'),
        });
        return;
      }

      // checks min username and password length
      if (username.length < 2 || password.length < 2) {
        dispatch.login.addError({
          type: 'error',
          description: i18next.t('form-validation.required-min-length', { length: 2 }),
        });
        return;
      }

      try {
        dispatch.login.getUser({ username, password });
        // const response: LoginBody = await doLogin(username as string, password as string);
        dispatch.login.clearError();
      } catch (e: any) {
        dispatch.login.addError({
          type: 'error',
          description: i18next.t('form-validation.unable-to-sign-in'),
        });
        // eslint-disable-next-line no-console
        console.error('login error', e.message);
      }
    },
    [dispatch]
  );

  const handleDoLogin = useCallback(
    async (data: FormValues) => {
      await makeLogin(data.username, data.password);
    },
    [makeLogin]
  );

  useEffect(() => {
    if (loginStore.token && typeof loginStore.error === 'undefined') {
      onClose();
    }
  }, [loginStore, onClose]);

  return (
    <Dialog
      data-testid="login--dialog"
      fullWidth={true}
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <LoginDialogCloseButton onClose={onClose} />
      <DialogContent data-testid="dialogContentLogin">
        <LoginDialogHeader />
        <LoginDialogForm error={loginStore.error} onSubmit={handleDoLogin} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
