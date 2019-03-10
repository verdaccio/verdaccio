/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import { ellipsis } from '../../utils/styles/mixings';

export const Wrapper = styled.span`
  && {
    vertical-align: middle;
    line-height: 22px;
    border-radius: 2px;
    color: #485a3e;
    background-color: #f3f4f2;
    padding: 0.22rem 0.4rem;
    margin: 8px 8px 0 0;
    ${ellipsis('300px')};
  }
`;
