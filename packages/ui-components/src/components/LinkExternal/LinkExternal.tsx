import Link from '@mui/material/Link';
import React from 'react';

const LinkExternal = ({
  ref,
  ...props
}: any & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
  const { to, children, variant, ...rest } = props;
  return (
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
};

export default LinkExternal;
