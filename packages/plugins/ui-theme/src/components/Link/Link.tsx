import React, { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Text, { TextProps } from '../Text';

interface Props extends Pick<TextProps, 'variant'> {
  external?: boolean;
  className?: string;
  to: string;
  children?: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

type LinkRef = HTMLAnchorElement;

/* eslint-disable verdaccio/jsx-spread */
const Link = React.forwardRef<LinkRef, Props>(function Link(
  { external, to, children, variant, className, ...props },
  ref
) {
  const LinkTextContent = <Text variant={variant}>{children}</Text>;
  return external ? (
    <a
      className={className}
      href={to}
      ref={ref}
      rel="noopener noreferrer"
      target="_blank"
      {...props}>
      {LinkTextContent}
    </a>
  ) : (
    <RouterLink className={className} innerRef={ref} to={to} {...props}>
      {LinkTextContent}
    </RouterLink>
  );
});

export default Link;
