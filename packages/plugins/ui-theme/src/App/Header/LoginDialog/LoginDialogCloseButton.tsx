import styled from '@emotion/styled';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DialogTitle from 'verdaccio-ui/components/DialogTitle';
import IconButton from 'verdaccio-ui/components/IconButton';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

const StyledIconButton = styled(IconButton)<{ theme?: Theme }>(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing() / 2,
  top: theme.spacing() / 2,
  color: theme.palette.grey[500],
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
