import { default as MaterialUITypography, TypographyProps } from '@material-ui/core/Typography';
import React, { forwardRef } from 'react';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingRef = HTMLHeadingElement;

interface Props extends Omit<TypographyProps, 'variant'> {
  variant?: HeadingType;
}

const Heading = forwardRef<HeadingRef, Props>(function Heading({ variant = 'h6', ...props }, ref) {
  return <MaterialUITypography {...props} variant={variant} ref={ref} />;
});

export default Heading;
