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
          <Earth name={ 'earth' } size={ 'md' } />
          <Flags>
            <Flag name={ 'spain' } size={ 'md' } />
            <Flag name={ 'nicaragua' } size={ 'md' } />
            <Flag name={ 'india' } size={ 'md' } />
            <Flag name={ 'brazil' } size={ 'md' } />
            <Flag name={ 'pakistan' } size={ 'md' } />
            <Flag name={ 'china' } size={ 'md' } />
            <Flag name={ 'austria' } size={ 'md' } />
          </Flags>
        </ToolTip>
      </Left>
      <Right>
        Powered by
        <Logo img={true} name={'verdaccio'} onClick={() => window.open('http://www.verdaccio.org/', '_blank')} pointer={true} size={'md'} />
        {`/ ${version}`}
      </Right>
    </Inner>
  </Wrapper>
);

export default Footer;
