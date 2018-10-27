/**
 * @prettier
 * @flow
 */

import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

const TxtField = ({ InputProps, classes, ...other }: TextFieldProps) => (
  <TextField
    {...other}
    InputProps={{
      ...InputProps,
      classes,
    }}
  />
);

export default TxtField;
