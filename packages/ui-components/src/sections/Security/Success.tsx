import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import SecurityLayout from '../../layouts/Security/Dialog';
import { SecurityContainer, SecurityForm } from './styles';

export enum MessageType {
  Login = 'Login',
  ChangePassword = 'ChangePassword',
  AddUser = 'AddUser',
  Success = 'Success',
}

const Success: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const messageType = queryParams.get('messageType') as MessageType;
  const message = !messageType
    ? t('security.success.messageSuccess')
    : t(`security.success.message${messageType}`);

  const handleClose = () => {
    window.location.href = '/';
  };

  return (
    <SecurityLayout>
      <SecurityContainer>
        <SecurityForm>
          <CheckCircleIcon color="success" />
          <Typography component="h1" gutterBottom={true} variant="h4">
            {t('security.success.title')}
          </Typography>
          <Typography color="text.secondary" paragraph={true} variant="body1">
            {message}
          </Typography>
          <Button color="primary" onClick={handleClose} sx={{ mt: 2 }} variant="contained">
            {t('security.success.submit')}
          </Button>
        </SecurityForm>
      </SecurityContainer>
    </SecurityLayout>
  );
};

export default Success;
