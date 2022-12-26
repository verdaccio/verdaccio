import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Content, Title } from './styles';
import { Props } from './types';

const RegistryInfoDialog: React.FC<Props> = ({ open = false, children, onClose, title = '' }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      data-testid={'registryInfo--dialog'}
      id="registryInfo--dialog-container"
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <Title>{title}</Title>
      <Content>{children}</Content>
      <DialogActions>
        <Button color="inherit" id="registryInfo--dialog-close" onClick={onClose}>
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistryInfoDialog;
