/**
 * @prettier
 * @flow
 */

import React from 'react';
import { IProps } from './types';
import { Wrapper } from './styles';

const NoItems = ({ text }: IProps) => (
  <Wrapper>
    <h2>{text}</h2>
  </Wrapper>
);

export default NoItems;
