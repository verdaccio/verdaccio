/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';

import { fontSize, lineHeight } from '../../utils/styles/sizes';

export const Wrapper = styled.div`
  && {
    font-size: ${fontSize.md};
    line-height: ${lineHeight.xl};
    border: none;
    outline: none;
    flex-direction: column;
    align-items: center;
  }
`;
