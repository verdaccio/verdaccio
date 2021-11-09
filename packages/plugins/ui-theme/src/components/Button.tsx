import { ButtonProps, default as MaterialUIButton } from '@mui/material/Button';
import React, { forwardRef } from 'react';

type ButtonRef = HTMLButtonElement;

const Button = forwardRef<ButtonRef, ButtonProps>(function Button(props, ref) {
  return <MaterialUIButton {...props} ref={ref} />;
});

export default Button;
