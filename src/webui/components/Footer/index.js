/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Element } from 'react';

import { version } from '../../../../package.json';
import { Wrapper, Left, Right, Earth, Flags, Love, Flag, Logo, Inner, ToolTip } from './styles';

const Footer = (): Element<Wrapper> => (
  <Wrapper>
    <Inner>
      <Left>
        Made with
        <Love>♥</Love>
        on
        <ToolTip>
          <Earth name="earth" />
          <Flags>
            <Flag name="spain" />
            <Flag name="nicaragua" />
            <Flag name="india" />
            <Flag name="brazil" />
            <Flag name="pakistan" />
            <Flag name="china" />
            <Flag name="austria" />
          </Flags>
        </ToolTip>
      </Left>
      <Right>
        Powered by
        <Logo name="verdaccio" size="md" pointer img onClick={() => window.open('http://www.verdaccio.org/', '_blank')} />
        {`/ ${version}`}
      </Right>
    </Inner>
  </Wrapper>
);

export default Footer;
