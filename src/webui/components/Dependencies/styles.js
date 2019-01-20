/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { default as MuiListItem } from '@material-ui/core/ListItem';
import { default as MuiCardContent } from '@material-ui/core/CardContent';

export const Content = styled.div`
  && {
    padding: 20px;
  }
`;

export const CardContent = styled(MuiCardContent)`
  && {
    padding-bottom: 0;
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

export const ListItem = styled(MuiListItem)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;
