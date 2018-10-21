/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';
import logo from './img/logo.svg';

const Logo = styled.div`
  && {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    background-position: center;
    background-size: contain;
    background-image: url(${logo});
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    ${props =>
      props.md &&
      css`
        width: 90px;
        height: 90px;
      `};
  }
`;

export default Logo;
