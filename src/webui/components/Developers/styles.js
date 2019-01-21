/**
 * @prettier
 */

import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography';
import { default as MuiFab } from '@material-ui/core/Fab';
import colors from '../../utils/styles/colors';

import { default as MuiCardContent } from '@material-ui/core/CardContent/index';

export const Details = styled('span')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Content = styled('div')`
  margin: -5px;
  display: flex;
  flex-wrap: wrap;
  > * {
    margin: 5px;
  }
`;

export const CardContent = styled(MuiCardContent)`
  && {
    padding-bottom: 20px;
  }
`;

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    margin-bottom: 10px;
    text-transform: capitalize;
  }
`;

export const Fab = styled(MuiFab)`
  && {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;
