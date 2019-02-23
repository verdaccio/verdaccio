/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Card from '@material-ui/core/Card/index';
import Typography from '@material-ui/core/Typography/index';
import Chip from '@material-ui/core/Chip/index';

export const CardWrap = styled(Card)`
  && {
    margin: 0 0 16px;
  }
`;

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const Tags = styled('div')`
  && {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    margin: 0 -5px;
  }
`;

export const Tag = styled(Chip)`
  && {
    margin: 5px;
  }
`;
