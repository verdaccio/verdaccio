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
  title?: string;
}

const Logo: React.FC<Props> = ({ size, onClick, className, isDefault = false, title = '' }) => {
  const { configOptions } = useConfig();
  if (!isDefault && configOptions?.logo) {
    return (
      <ImageLogo className={className} onClick={onClick}>
        <img alt={title} data-testid={'custom-logo'} height="40px" src={configOptions.logo} />
      </ImageLogo>
    );
  }

  return (
    <StyledLogo
      className={className}
      data-testid={'default-logo'}
      onClick={onClick}
      size={size}
      title={title}
    />
  );
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
