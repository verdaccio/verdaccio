/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Element } from 'react';

import { IProps } from './types';
import { Wrapper } from './styles';

const Tag = ({ children }: IProps): Element<Wrapper> => (<Wrapper>
{children}
</Wrapper>);

export default Tag;
