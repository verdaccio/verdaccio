import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography';
import { default as MuiListItem } from '@material-ui/core/ListItem';
import { default as MuiCardContent } from '@material-ui/core/CardContent';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
  }
`;

export const ListItem = styled(MuiListItem)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const CardContent = styled(MuiCardContent)`
  && {
    padding-bottom: 0;
  }
`;
