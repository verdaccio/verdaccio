/**
 * @prettier
 * @flow
 */

import { css } from 'react-emotion';

const ellipsis = (maxWidth: number) => css`
  white-space: nowrap;
  max-width: ${maxWidth}px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export default ellipsis;
