/**
 * @prettier
 * @flow
 */

import React from 'react';
import styled from 'react-emotion';
import { fontWeight } from '../../utils/styles/sizes';
import ellipsis from '../../utils/styles/ellipsis';

import type { Node } from 'react';
import { IProps } from './types';

const Wrapper = styled.span`
  font-weight: ${({ weight }) => fontWeight[weight]};
  text-transform: ${({ capitalize }) => (capitalize ? 'capitalize' : 'none')};
  ${props => props.limit && ellipsis(props.limit)};
`;

const Label = ({ text = '', capitalize = false, weight = 'regular', ...props }: IProps): Node => (
  <Wrapper weight={weight} capitalize={capitalize} {...props}>
    {text}
  </Wrapper>
);

export default Label;
