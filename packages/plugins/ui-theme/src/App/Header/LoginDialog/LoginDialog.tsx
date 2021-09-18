import i18next from 'i18next';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from 'verdaccio-ui/components/Dialog';
import DialogContent from 'verdaccio-ui/components/DialogContent';
import { LoginBody } from 'verdaccio-ui/providers/API/APIProvider';

import { Dispatch, RootState } from '../../../store/store';

import LoginDialogCloseButton from './LoginDialogCloseButton';
import LoginDialogForm, { FormValues } from './LoginDialogForm';
import LoginDialogHeader from './LoginDialogHeader';

interface Props {
  open?: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<Props> = ({ onClose, open = false }) => {
  const loginStore = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<Dispatch>();
  const makeLogin = useCallback(
    async (username?: string, password?: string): Promise<LoginBody> => {
      // checks isEmpty
      if (isEmpty(username) || isEmpty(password)) {
        const error = {
          type: 'error',
          description: i18next.t('form-validation.username-or-password-cant-be-empty'),
        };
        return { error };
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
      id="login--dialog"
      maxWidth="sm"
      onClose={onClose}
      open={open}>
      <LoginDialogCloseButton onClose={onClose} />
      <DialogContent>
        <LoginDialogHeader />
        <LoginDialogForm error={loginStore.error} onSubmit={handleDoLogin} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
