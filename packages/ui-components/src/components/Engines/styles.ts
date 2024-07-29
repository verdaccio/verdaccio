import styled from '@emotion/styled';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { Theme } from '../../Theme';

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
  // textTransform: 'capitalize', // apm
}));

export const EngineListItem = styled(ListItem)({
  padding: 0,
});
