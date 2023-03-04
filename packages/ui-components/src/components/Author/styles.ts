import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Theme } from '../../Theme';

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
}));

export const AuthorListItem = styled(ListItem)({
  padding: 0,
  ':hover': {
    backgroundColor: 'transparent',
  },
});

export const AuthorListItemText = styled(ListItemText)({
  padding: '0 10px',
  margin: 0,
});
