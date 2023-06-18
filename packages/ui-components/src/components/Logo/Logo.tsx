import styled from '@emotion/styled';
import React from 'react';

import { Theme, useConfig } from '../../';

const blackAndWithLogo = require('./img/logo-black-and-white.svg');
const defaultLogo = require('./img/logo.svg');

const sizes = {
  'x-small': '30px',
  small: '40px',
  big: '90px',
};

const logos = {
  light: defaultLogo,
  dark: blackAndWithLogo,
};

interface Props {
  size?: keyof typeof sizes;
  onClick?: () => void;
  className?: string;
  isDefault?: boolean;
}

const Logo: React.FC<Props> = ({ size, onClick, className, isDefault = false }) => {
  const { configOptions } = useConfig();
  if (!isDefault && (configOptions?.logo || configOptions?.logoURI)) {
    return (
      <ImageLogo className={className} onClick={onClick}>
        <img alt="logo" height="40px" src={(configOptions?.logo || configOptions?.logoURI)} />
      </ImageLogo>
    );
  }
  return <StyledLogo className={className} onClick={onClick} size={size} />;
};

export default Logo;

const ImageLogo = styled('div')({
  fontSize: 0,
});

const StyledLogo = styled('div')<Props & { theme?: Theme }>(({ size = 'small', theme }) => ({
  display: 'inline-block',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  backgroundImage: `url(${logos[theme?.palette.mode]})`,
  backgroundRepeat: ' no-repeat',
  width: sizes[size],
  height: sizes[size],
}));
