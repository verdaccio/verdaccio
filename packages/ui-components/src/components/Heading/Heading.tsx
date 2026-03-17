import type { TypographyProps } from '@mui/material/Typography';
import { default as MaterialUITypography } from '@mui/material/Typography';
import React from 'react';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingRef = HTMLHeadingElement;

interface Props extends Omit<TypographyProps, 'variant'> {
  variant?: HeadingType;
}

const Heading = function Heading({
  ref,
  variant = 'h6',
  ...props
}: Props & { ref?: React.RefObject<HeadingRef | null> }) {
  return <MaterialUITypography {...props} ref={ref} variant={variant} />;
};

export default Heading;
