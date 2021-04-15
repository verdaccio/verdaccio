import { default as MaterialUIBox, BoxProps } from '@material-ui/core/Box';
import React from 'react';

function Box(props: BoxProps) {
  return <MaterialUIBox {...props} />;
}

export default Box;
