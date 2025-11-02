import styled from '@emotion/styled';
import { default as MuiListItemText } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { common } from '@mui/material/colors';

import { Theme } from '../../Theme';

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme.fontWeight.bold,
}));

export const Spacer = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  flex: '1 1 auto',
  borderBottom: `1px dotted ${
    theme.palette.mode == 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
  } `,
  whiteSpace: 'nowrap',
  height: '0.5em',
  margin: '0 16px',
}));

export const ListItemText = styled(MuiListItemText)<{ theme?: Theme }>(({ theme }) => ({
  flex: 'none',
  color: theme.palette.mode == 'light' ? theme.palette.black : common.white,
  opacity: 0.6,
}));
