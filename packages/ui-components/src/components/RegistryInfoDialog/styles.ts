import styled from '@emotion/styled';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { Theme } from '../../';

export const Title = styled(DialogTitle)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor:
    theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
  color: theme?.palette.white,
  fontSize: theme?.fontSize.lg,
}));

export const Content = styled(DialogContent)<{ theme?: Theme }>(({ theme }) => ({
  padding: '0 24px',
  backgroundColor: theme?.palette.background.default,
}));

export const TextContent = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  padding: '10px 24px',
  backgroundColor: theme?.palette.background.default,
}));
