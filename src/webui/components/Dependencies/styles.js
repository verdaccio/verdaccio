/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

export const Content = styled.div`
  && {
    padding: 20px;
  }
`;

export const CardWrap = styled(Card)`
  && {
    margin: 0 0 25px;
  }
`;

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
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
