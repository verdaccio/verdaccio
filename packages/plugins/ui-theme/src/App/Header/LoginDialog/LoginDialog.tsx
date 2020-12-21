import React, { useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from 'verdaccio-ui/components/Dialog';
import DialogContent from 'verdaccio-ui/components/DialogContent';
import { makeLogin, LoginError } from 'verdaccio-ui/utils/login';
import storage from 'verdaccio-ui/utils/storage';

import AppContext from '../../../App/AppContext';

import LoginDialogCloseButton from './LoginDialogCloseButton';
import LoginDialogForm, { FormValues } from './LoginDialogForm';
import LoginDialogHeader from './LoginDialogHeader';

interface Props {
  open?: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<Props> = ({ onClose, open = false }) => {
  const { t } = useTranslation();
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw Error(t('app-context-not-correct-used'));
  }

  const [error, setError] = useState<LoginError>();

  const handleDoLogin = useCallback(
    async (data: FormValues) => {
      const { username, token, error } = await makeLogin(data.username, data.password);

      if (error) {
        setError(error);
      }

      if (username && token) {
        storage.setItem('username', username);
        storage.setItem('token', token);
        appContext.setUser({ username });
        onClose();
      }
    },
    [appContext, onClose]
  );

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
        <LoginDialogForm error={error} onSubmit={handleDoLogin} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
