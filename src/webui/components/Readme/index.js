/**
 * @prettier
 * @flow
 */

import React from 'react';
import 'github-markdown-css';

import { IProps } from './types';

const Readme = ({ description }: IProps) => <div className={'markdown-body'} dangerouslySetInnerHTML={{ __html: description }} />;

export default Readme;
