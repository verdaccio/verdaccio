import { default as MaterialUITextField, TextFieldProps } from '@material-ui/core/TextField';
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
      innerRef={ref}
      InputProps={{
        ...InputProps,
        classes,
      }}
    />
  );
});

export default TextField;
