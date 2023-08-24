import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type LinkRef = HTMLAnchorElement;

export const CustomRouterLink = styled(RouterLink)`
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

// TODO: improve any with custom types for a and RouterLink
const Link = React.forwardRef<LinkRef, any>(function LinkFunction(
  { external, to, children, variant, className, onClick },
  ref
) {
  return external ? (
    <a
      className={className}
      href={to}
      onClick={onClick}
      ref={ref}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Typography variant={variant ?? 'caption'}>{children}</Typography>
    </a>
  ) : (
    <CustomRouterLink className={className} innerRef={ref} onClick={onClick} to={to}>
      <Typography variant={variant}>{children}</Typography>
    </CustomRouterLink>
  );
});

export default Link;
