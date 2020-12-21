import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'verdaccio-ui/components/Button';
import Dialog from 'verdaccio-ui/components/Dialog';
import DialogActions from 'verdaccio-ui/components/DialogActions';

import { Title, Content } from './styles';
import { Props } from './types';

const RegistryInfoDialog: React.FC<Props> = ({ open = false, children, onClose }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      data-testid={'registryInfo--dialog'}
      id="registryInfo--dialog-container"
      onClose={onClose}
      open={open}>
      <Title disableTypography={true}>{t('dialog.registry-info.title')}</Title>
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
