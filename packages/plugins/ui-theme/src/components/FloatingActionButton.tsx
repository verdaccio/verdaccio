import { FabProps, default as MaterialUIFab } from '@mui/material/Fab';
import React, { forwardRef } from 'react';

type FloatingActionButtonRef = HTMLButtonElement;

const FloatingActionButton = forwardRef<FloatingActionButtonRef, FabProps>(
  function FloatingActionButton(props, ref) {
    return <MaterialUIFab {...props} ref={ref} data-testid="fab" />;
  }
);

export default FloatingActionButton;
