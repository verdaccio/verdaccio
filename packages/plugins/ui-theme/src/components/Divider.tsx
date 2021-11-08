import { DividerProps, default as MaterialUIDivider } from '@mui/material/Divider';
import React, { forwardRef } from 'react';

type DividerRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const Divider = forwardRef<DividerRef, DividerProps>(function Divider(props, ref) {
  return <MaterialUIDivider {...props} innerRef={ref} />;
});

export default Divider;
