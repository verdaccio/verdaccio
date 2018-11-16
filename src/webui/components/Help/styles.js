/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Card from '@material-ui/core/Card/index';
import Typography from '@material-ui/core/Typography/index';

export const CardStyled = styled(Card)`
  && {
    width: 600px;
    margin: auto;
  }
`;

export const HelpTitle = styled(Typography)`
  && {
    margin-bottom: 20px;
  }
`;
