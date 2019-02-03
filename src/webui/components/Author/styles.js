/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography/index';
import ListItem from '@material-ui/core/ListItem/index';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    margin-bottom: 10px;
    text-transform: capitalize;
  }
`;

export const InstallItem = styled(ListItem)`
  && {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;
