/**
 * @prettier
 * @flow
 */

import React from 'react';
import { TextFieldProps, default as TextFieldMaterialUI } from '@material-ui/core/TextField';

const TextField = ({ InputProps, classes, ...other }: TextFieldProps) => (
  <TextFieldMaterialUI
    {...other}
    InputProps={{
      ...InputProps,
      classes,
    }}
  />
);

export default TextField;
