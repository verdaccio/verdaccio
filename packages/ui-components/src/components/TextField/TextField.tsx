/* eslint-disable verdaccio/jsx-spread */
import { default as MaterialUITextField, TextFieldProps } from '@mui/material/TextField';
import React, { forwardRef } from 'react';

// The default element type of MUI's TextField is 'div'
type TextFieldRef = HTMLDivElement;

const TextField = forwardRef<TextFieldRef, TextFieldProps>(function TextField(
  { InputProps, classes, ...props },
  ref
) {
  return (
    <MaterialUITextField
      {...props}
      InputProps={{
        ...InputProps,
        classes,
      }}
      ref={ref}
    />
  );
});

export default TextField;
