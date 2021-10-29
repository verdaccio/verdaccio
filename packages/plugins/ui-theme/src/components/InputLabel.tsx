import { InputLabelProps, default as MaterialUIInputLabel } from '@material-ui/core/InputLabel';
import React, { forwardRef } from 'react';

type InputLabelRef = HTMLLabelElement;

const InputLabel = forwardRef<InputLabelRef, InputLabelProps>(function InputLabel(props, ref) {
  return <MaterialUIInputLabel {...props} ref={ref} />;
});

export default InputLabel;
