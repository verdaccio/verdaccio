import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { Theme } from '../../Theme';

export const CardWrap = styled(Card)({
  margin: '0 0 16px',
});

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

export const Tags = styled('div')({
  display: 'flex',
  justifyContent: 'start',
  flexWrap: 'wrap',
  margin: '0 -5px',
});

export const Tag = styled(Chip)({
  margin: '5px',
});
