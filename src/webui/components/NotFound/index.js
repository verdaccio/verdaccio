/**
 * @prettier
 * @flow
 */

import React from 'react';
import { Wrapper } from './styles';
import { IProps } from './types';

const NotFound = ({ pkg }: IProps) => (
  <Wrapper>
    <h1>
      // TODO. Resolved the rule react/jsx-one-expression-per-line for now, but in the future we are going to use i18n here
      {'Error 404 -'}
      {pkg}
    </h1>
    <hr />
    <p>Oops, The package you are trying to access does not exist.</p>
  </Wrapper>
);

export default NotFound;
