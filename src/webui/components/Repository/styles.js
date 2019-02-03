/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Grid from '@material-ui/core/Grid/index';
import Typography from '@material-ui/core/Typography/index';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const GridRepo = styled(Grid)`
  && {
    align-items: center;
  }
`;
