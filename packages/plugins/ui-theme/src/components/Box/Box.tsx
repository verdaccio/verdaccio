import { default as MaterialUIBox, BoxProps } from '@material-ui/core/Box';
import React from 'react';

const Box: React.FC<BoxProps> = (props) => <MaterialUIBox {...props} />;

export default Box;
