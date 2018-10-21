/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Node } from 'react';

import { IProps } from './interfaces';
import { Wrapper, Circular } from './styles';

const Spinner = ({ size = 50, centered = false }: IProps): Node => (
  <Wrapper centered={centered}>
    <Circular size={size} />
  </Wrapper>
);

export default Spinner;
