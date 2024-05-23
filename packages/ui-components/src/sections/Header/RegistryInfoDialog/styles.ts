import styled from '@emotion/styled';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { Theme } from '../../../';

export const Title = styled(DialogTitle)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme?.palette.primary.main,
  color: props.theme?.palette.white,
  fontSize: props.theme?.fontSize.lg,
}));

export const Content = styled(DialogContent)<{ theme?: Theme }>(({ theme }) => ({
  padding: '0 24px',
  backgroundColor: theme?.palette.background.default,
}));
