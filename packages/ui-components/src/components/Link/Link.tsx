import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router';

const CustomRouterLink = styled(RouterLink)`
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

const Link = function LinkFunction({
  ref,
  to,
  children,
  variant,
  className,
  onClick,
}: any & { ref?: React.RefObject<HTMLAnchorElement | null> }) {
  return (
    <CustomRouterLink className={className} onClick={onClick} ref={ref} to={to}>
      <Typography color="primary" variant={variant}>
        {children}
      </Typography>
    </CustomRouterLink>
  );
};

export default Link;
