import styled from '@emotion/styled';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { Theme } from '../../Theme';

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

export const DistListItem = styled(ListItem)({
  paddingLeft: 0,
  paddingRight: 0,
  flexWrap: 'wrap',
});

export const DistChips = styled(Chip)({
  marginRight: 5,
  textTransform: 'capitalize',
  marginTop: 5,
});
