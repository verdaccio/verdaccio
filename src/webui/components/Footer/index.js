/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Element } from 'react';

import { version } from '../../../../package.json';
import { Wrapper, Left, Right, Earth, Flags, Love, Flag, Logo, Inner, ToolTip } from './styles';
import { goToVerdaccioWebsite } from '../../utils/windows.js';

const renderTooltip = () => (
  <ToolTip>
    <Earth name={'earth'} size={'md'} />
    <Flags>
      <Flag name={'spain'} size={'md'} />
      <Flag name={'nicaragua'} size={'md'} />
      <Flag name={'india'} size={'md'} />
      <Flag name={'brazil'} size={'md'} />
      <Flag name={'pakistan'} size={'md'} />
      <Flag name={'china'} size={'md'} />
      <Flag name={'austria'} size={'md'} />
    </Flags>
  </ToolTip>
);
const POWERED_LABEL = 'Powered by';
const MADEWITH_LABEL = ' Made with';
const ON_LABEL = 'on';
const HEARTH_EMOJI = '♥';

const renderRight = () => (
  <Right>
    {POWERED_LABEL}
    <Logo img={true} name={'verdaccio'} onClick={goToVerdaccioWebsite} pointer={true} size={'md'} />
    {`/ ${version}`}
  </Right>
);

const renderLeft = () => (
  <Left>
    {MADEWITH_LABEL}
    <Love>{HEARTH_EMOJI}</Love>
    {ON_LABEL}
    {renderTooltip()}
  </Left>
);

const Footer = (): Element<Wrapper> => (
  <Wrapper>
    <Inner>
      {renderLeft()}
      {renderRight()}
    </Inner>
  </Wrapper>
);

export default Footer;
