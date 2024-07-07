import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../';

const StyledIconButton = styled(IconButton)<{ theme?: Theme }>(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing() / 2,
  top: theme.spacing() / 2,
  color: theme.palette.grey[500],
  zIndex: 99,
}));

interface Props {
  onClose: () => void;
}

const LoginDialogCloseButton: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <DialogTitle>
      <StyledIconButton data-testid="close-login-dialog-button" onClick={onClose}>
        <CloseIcon titleAccess={t('button.close')} />
      </StyledIconButton>
    </DialogTitle>
  );
};

export default LoginDialogCloseButton;
