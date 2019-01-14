/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Card from '@material-ui/core/Card/index';

export const Content = styled.div`
  && {
    padding: 20px;
  }
`;

export const Tags = styled.span`
  && {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
  }
`;

export const Tag = styled.span`
  && {
    margin: 5px;
  }
`;

export const CardWrap = styled(Card)`
  && {
    margin: 0 0 25px;
  }
`;
