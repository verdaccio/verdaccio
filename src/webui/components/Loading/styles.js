/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';

export const Wrapper = styled.div`
  && {
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    position: absolute;
  }
`;

export const Badge = styled.div`
  && {
    margin: 0 0 30px 0;
    border-radius: 25px;
    box-shadow: 0 10px 20px 0 rgba(69, 58, 100, 0.2);
    background: #f7f8f6;
  }
`;
