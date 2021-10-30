import {
  FormHelperTextProps,
  default as MaterialUIFormHelperText,
} from '@mui/material/FormHelperText';
import React, { forwardRef } from 'react';

type FormHelperTextRef = HTMLParagraphElement;

const FormHelperText = forwardRef<FormHelperTextRef, FormHelperTextProps>(function FormHelperText(
  props,
  ref
) {
  return <MaterialUIFormHelperText {...props} ref={ref} />;
});

export default FormHelperText;
