import { default as MaterialUIDivider, DividerProps } from '@material-ui/core/Divider';
import React, { forwardRef } from 'react';

type DividerRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const Divider = forwardRef<DividerRef, DividerProps>(function Divider(props, ref) {
  return <MaterialUIDivider {...props} innerRef={ref} />;
});

export default Divider;
