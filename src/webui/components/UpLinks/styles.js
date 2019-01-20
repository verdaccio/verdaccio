import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography';
import { default as MuiListItemText } from '@material-ui/core/ListItemText';

export const Heading = styled(Typography)`
 && {
  font-weight: 700;
 }
`;

export const Spacer = styled('div')`
    flex: 1 1 auto;
    border-bottom: 1px dotted rgba(0, 0, 0, .2);
    white-space: nowrap;
    height: 0.5em;
`;

export const ListItemText = styled(MuiListItemText)`
    && {
      flex: none;
      color: black;
      opacity: .6;
    }
`;

