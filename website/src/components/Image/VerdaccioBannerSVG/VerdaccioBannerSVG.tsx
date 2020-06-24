/* eslint-disable verdaccio/jsx-spread */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import logo from './verdaccio.svg';

export const VerdaccioBannerSVG = (props: any) => {
  return <img src={logo} alt="verdaccio logo" {...props} />;
};
