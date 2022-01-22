import { ChipProps, default as MaterialUIChip } from '@mui/material/Chip';
import React, { forwardRef } from 'react';

type ChipRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const Chip = forwardRef<ChipRef, ChipProps>(function Chip(props) {
  return <MaterialUIChip {...props} />;
});

export default Chip;
