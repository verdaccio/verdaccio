import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { common } from '@mui/material/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Theme } from '../../';

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
  margin: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.cyanBlue,
  color: common.white,
}));

const StyledIconButton = styled(IconButton)<{ theme?: Theme }>(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing() / 2,
  top: theme.spacing() / 2,
  color: theme.palette.grey[500],
}));
