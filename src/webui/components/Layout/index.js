/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';

export const Content = styled.div`
  && {
    background-color: #ffffff;
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column;
  }
`;

export const Container = styled.div`
  && {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
    ${({ isLoading }) =>
      isLoading &&
      css`
        ${Content} {
          background-color: #f5f6f8;
        }
      `}
`;
