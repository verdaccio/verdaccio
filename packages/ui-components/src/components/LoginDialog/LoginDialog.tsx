import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect } from 'react';

import { useAuth } from '../../providers/AuthProvider';
import LoginFormHeader from '../LoginForm/styles';
import LoginDialogCloseButton from './LoginDialogCloseButton';
import LoginDialogForm from './LoginDialogForm';

interface Props {
  open?: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<Props> = ({ onClose, open = false }) => {
  const { userState } = useAuth();
  useEffect(() => {
    if (userState?.token) {
      onClose();
    }
  }, [onClose, userState]);
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
        <LoginFormHeader />
        <LoginDialogForm />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
