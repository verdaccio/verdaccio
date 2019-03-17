/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import ListItem from '@material-ui/core/ListItem/index';
import Typography from '@material-ui/core/Typography/index';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const EngineListItem = styled(ListItem)`
  && {
    padding-left: 0;
  }
`;
