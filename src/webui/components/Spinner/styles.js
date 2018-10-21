/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';
import CircularProgress from '@material-ui/core/CircularProgress';
import colors from '../../utils/styles/colors';

export const Wrapper = styled.div`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    ${props =>
      props.centered &&
      css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `}
`;

export const Circular = styled(CircularProgress)`
  && {
    color: ${colors.primary}
`;
