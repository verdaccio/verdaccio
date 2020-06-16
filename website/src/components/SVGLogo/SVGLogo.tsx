/* eslint-disable verdaccio/jsx-spread */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import logo from './verdaccio-tiny.svg';

export const SVGLogo = (props: any) => {
  return <img src={logo} alt="logo" {...props} />;
};
