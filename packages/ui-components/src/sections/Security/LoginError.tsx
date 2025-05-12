import { Error } from '@mui/icons-material';
import { Box, SnackbarContent, styled } from '@mui/material';
import React, { memo } from 'react';

import { LoginV1Error, Theme } from '../../';

const StyledSnackbarContent = styled(SnackbarContent)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme.palette.error.dark,
  color: theme.palette.white,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledErrorIcon = styled(Error)<{ theme?: Theme }>(({ theme }) => ({
  fontSize: 20,
  opacity: 0.9,
  marginRight: theme.spacing(1),
}));

interface Props {
  error: LoginV1Error;
}

const LoginError = memo(({ error }: Props) => {
  return (
    <StyledSnackbarContent
      message={
        <Box alignItems="center" data-testid="error" display="flex">
          <StyledErrorIcon />
          {error.description}
        </Box>
      }
    />
  );
});

export default LoginError;
