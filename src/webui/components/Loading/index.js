/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Node } from 'react';

import Logo from '../Logo';
import Spinner from '../Spinner';

import { Wrapper, Badge } from './styles';

const Loading = (): Node => (
  <Wrapper>
    <Badge>
      <Logo md />
    </Badge>
    <Spinner />
  </Wrapper>
);

export default Loading;
