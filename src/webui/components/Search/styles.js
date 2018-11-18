/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';

import mq from '../../utils/styles/media';

export const AutoCompleteWrapper = styled.div`
  && {
    display: none;
    max-width: 393px;
    width: 100%;
    display: none;
    ${mq.medium(css`
      display: flex;
    `)};
  }
`;
