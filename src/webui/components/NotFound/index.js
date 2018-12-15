/**
 * @prettier
 * @flow
 */

import React from 'react';
import { Wrapper } from './styles';
import { IProps } from './types';

const NotFound = ({ pkg }: IProps) => (
  <Wrapper>
    <h1>Error 404 - {pkg}</h1>
    <hr />
    <p>Oops, The package you are trying to access does not exist.</p>
  </Wrapper>
);

export default NotFound;
