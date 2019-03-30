/**
 * @prettier
 * @flow
 */

import React from 'react';
import Typography from '@material-ui/core/Typography/index';

import { IProps } from './types';

const NoItems = ({ text }: IProps) => (
  <Typography gutterBottom={true} variant={'subtitle1'}>
    {text}
  </Typography>
);

export default NoItems;
