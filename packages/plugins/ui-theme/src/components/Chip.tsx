import { default as MaterialUIChip, ChipProps } from '@material-ui/core/Chip';
import React, { forwardRef } from 'react';

type ChipRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const Chip = forwardRef<ChipRef, ChipProps>(function Chip(props, ref) {
  return <MaterialUIChip {...props} innerRef={ref} />;
});

export default Chip;
