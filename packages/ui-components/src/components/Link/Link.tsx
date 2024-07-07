import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const CustomRouterLink = styled(RouterLink)`
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

const Link = React.forwardRef<HTMLAnchorElement, any>(function LinkFunction(
  { to, children, variant, className, onClick },
  ref
) {
  return (
    <CustomRouterLink className={className} innerRef={ref} onClick={onClick} to={to}>
      <Typography variant={variant}>{children}</Typography>
    </CustomRouterLink>
  );
});

export default Link;
