import Link from '@mui/material/Link';
import React from 'react';

const LinkExternal = React.forwardRef<HTMLAnchorElement, any>((props, ref) => {
  const { to, children, variant, ...rest } = props;
  return (
    // eslint-disable-next-line verdaccio/jsx-spread
    <Link
      href={to}
      ref={ref}
      rel="noopener noreferrer"
      target="_blank"
      underline="hover"
      variant={variant ?? 'caption'}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default LinkExternal;
