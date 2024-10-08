/* eslint-disable verdaccio/jsx-spread */
import styled from '@emotion/styled';
import React from 'react';

import { FontWeight, Theme } from '../../';

interface Props {
  text: string;
  capitalize?: boolean;
  weight?: FontWeight;
}

interface WrapperProps {
  capitalize: boolean;
  weight: FontWeight;
}

const Wrapper = styled('div')<WrapperProps & { theme?: Theme }>((props) => ({
  fontWeight: props.theme.fontWeight[props.weight],
  textTransform: props.capitalize ? 'capitalize' : 'none',
}));

const Label: React.FC<Props> = ({
  text = '',
  capitalize = false,
  weight = 'regular',
  ...props
}) => {
  return (
    <Wrapper capitalize={capitalize} weight={weight} {...props}>
      {text}
    </Wrapper>
  );
};

export default Label;
