import { default as MaterialUITypography, TypographyProps } from '@mui/material/Typography';
import React, { forwardRef } from 'react';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingRef = HTMLHeadingElement;

interface Props extends Omit<TypographyProps, 'variant'> {
  variant?: HeadingType;
}

const Heading = forwardRef<HeadingRef, Props>(function Heading({ variant = 'h6', ...props }, ref) {
  // eslint-disable-next-line verdaccio/jsx-spread
  return <MaterialUITypography {...props} ref={ref} variant={variant} />;
});

export default Heading;
