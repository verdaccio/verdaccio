/**
 * @prettier
 */

/* @flow */

import React from 'react';
import {IProps} from './interfaces';

const Link = ({children, to = '#', blank = false, ...props}: IProps): ReactElement => (
  <a href={to} target={blank ? '_blank' : '_self'} {...props}>
    {children}
  </a>
);

export default Link;
