import { InputProps, default as MaterialUIInput } from '@mui/material/Input';
import React, { forwardRef } from 'react';

type InputRef = HTMLDivElement;

const Input = forwardRef<InputRef, InputProps>(function Input(props, ref) {
  return <MaterialUIInput {...props} ref={ref} />;
});

export default Input;
