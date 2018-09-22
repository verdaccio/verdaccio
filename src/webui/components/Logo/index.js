/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import logo from './img/logo.svg';

const Logo = styled.div`
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  background-position: center;
  background-size: contain;
  background-image: url(${logo});
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
`;

export default Logo;
