import { default as MaterialUIToolbar, ToolbarProps } from '@mui/material/Toolbar';
import React, { forwardRef } from 'react';

type ToolbarRef = HTMLDivElement;

const Toolbar = forwardRef<ToolbarRef, ToolbarProps>(function Toolbar(props, ref) {
  return <MaterialUIToolbar {...props} ref={ref} />;
});

export default Toolbar;
