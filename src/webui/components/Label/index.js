/**
 * @prettier
 * @flow
 */

import React from 'react';
import styled from 'react-emotion';
import { fontWeight } from '../../utils/styles/sizes';

import type { Node } from 'react';
import { IProps } from './types';

const Wrapper = styled.div`
  font-weight: ${({ weight }) => fontWeight[weight]};
  text-transform: ${({ capitalize }) => (capitalize ? 'capitalize' : 'none')};
  ${({ modifiers }: IProps) => modifiers && modifiers};
`;

const Label = ({ text = '', capitalize = false, weight = 'regular', ...props }: IProps): Node => {
  return (
    <Wrapper capitalize={ capitalize } weight={ weight } {...props}>
      {text}
    </Wrapper>
  );
};

export default Label;
