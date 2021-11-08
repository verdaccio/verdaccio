import { IconButtonProps, default as MaterialUIIconButton } from '@mui/material/IconButton';
import React, { forwardRef } from 'react';

type IconButtonRef = HTMLButtonElement;

const IconButton = forwardRef<IconButtonRef, IconButtonProps>(function IconButton(props, ref) {
  return <MaterialUIIconButton {...props} ref={ref} />;
});

export default IconButton;
