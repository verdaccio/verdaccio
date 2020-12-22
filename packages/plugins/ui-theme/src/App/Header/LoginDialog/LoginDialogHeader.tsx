import styled from '@emotion/styled';
import CloseIcon from '@material-ui/icons/Close';
import LockOutlined from '@material-ui/icons/LockOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from 'verdaccio-ui/components/Avatar';
import Box from 'verdaccio-ui/components/Box';
import Heading from 'verdaccio-ui/components/Heading';
import IconButton from 'verdaccio-ui/components/IconButton';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
interface Props {
  onClose?: () => void;
}

const LoginDialogHeader: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Box alignItems="center" display="flex" flexDirection="column" position="relative">
      {onClose && (
        <StyledIconButton aria-label={t('button.close')} onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>
      )}
      <StyledAvatar>
        <LockOutlined />
      </StyledAvatar>
      <Heading>{t('button.login')}</Heading>
    </Box>
  );
};

export default LoginDialogHeader;

const StyledAvatar = styled(Avatar)<{ theme?: Theme }>(({ theme }) => ({
  margin: theme?.spacing(1),
  backgroundColor:
    theme?.palette.type === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
  color: theme?.palette.white,
}));

const StyledIconButton = styled(IconButton)<{ theme?: Theme }>(({ theme }) => ({
  position: 'absolute',
  right: theme?.spacing() / 2,
  top: theme?.spacing() / 2,
  color: theme?.palette.grey[500],
}));
