import styled from '@emotion/styled';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import Text from '../Text';

export const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
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
