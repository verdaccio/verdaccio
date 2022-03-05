import styled from '@emotion/styled';
import Error from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import SnackbarContent from '@mui/material/SnackbarContent';
import React, { memo } from 'react';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { LoginError } from 'verdaccio-ui/utils/login';

const StyledSnackbarContent = styled(SnackbarContent)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme?.palette.error.dark,
  color: theme?.palette.white,
}));

const StyledErrorIcon = styled(Error)<{ theme?: Theme }>(({ theme }) => ({
  fontSize: 20,
  opacity: 0.9,
  marginRight: theme?.spacing(1),
}));

export interface FormValues {
  username: string;
  password: string;
}

interface Props {
  error: LoginError;
}

const LoginDialogFormError = memo(({ error }: Props) => {
  return (
    <StyledSnackbarContent
      message={
        <Box alignItems="center" display="flex">
          <StyledErrorIcon />
          {error.description}
        </Box>
      }
    />
  );
});

export default LoginDialogFormError;
