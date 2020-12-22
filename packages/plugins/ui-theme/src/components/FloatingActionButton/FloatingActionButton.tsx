import { default as MaterialUIFab, FabProps } from '@material-ui/core/Fab';
import React, { forwardRef } from 'react';

type FloatingActionButtonRef = HTMLButtonElement;

const FloatingActionButton = forwardRef<FloatingActionButtonRef, FabProps>(
  function FloatingActionButton(props, ref) {
    return <MaterialUIFab {...props} ref={ref} data-testid="fab" />;
  }
);

export default FloatingActionButton;
