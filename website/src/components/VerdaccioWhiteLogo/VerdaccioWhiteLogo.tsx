/* eslint-disable verdaccio/jsx-spread */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import logo from './verdaccio-tiny.svg';

export const VerdaccioWhiteLogo = (props: any) => {
  return <img src={logo} alt="logo" {...props} />;
};
