/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography';
import { default as MuiList } from '@material-ui/core/List';
import { default as MuiCard } from '@material-ui/core/Card';

export const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 16px;
`;

export const Inner = styled('div')`
  max-width: 650px;
  display: flex;
  flex-direction: column;
`;

export const EmptyPackage = styled('img')`
  width: 150px;
  margin: 0 auto;
`;

export const Heading = styled(Typography)`
  && {
    color: #4b5e40;
  }
`;

export const List = styled(MuiList)`
  && {
    padding: 0;
    color: #4b5e40;
  }
`;

export const Card = styled(MuiCard)`
  margin-top: 24px;
`;
