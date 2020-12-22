import { default as MaterialUITypography } from '@material-ui/core/Typography';
import React, { forwardRef } from 'react';

import { TextProps } from './TextConfig';

type TextRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

// The reference is already from type of the Component, so the any below is not a problem
const Text = forwardRef<TextRef, TextProps>(function Text(props, ref) {
  return <MaterialUITypography {...props} component="span" ref={ref} />;
});

Text.defaultProps = {
  variant: 'subtitle1',
};

export default Text;
