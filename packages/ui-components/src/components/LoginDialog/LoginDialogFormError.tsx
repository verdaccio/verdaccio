import styled from '@emotion/styled';
import Error from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import SnackbarContent from '@mui/material/SnackbarContent';
import { common } from '@mui/material/colors';
import React, { memo } from 'react';

import { Theme } from '../../';

const StyledSnackbarContent = styled(SnackbarContent)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme.palette.error.dark,
  marginTop: theme.spacing(2),
  color: common.white,
}));

const StyledErrorIcon = styled(Error)<{ theme?: Theme }>(({ theme }) => ({
  fontSize: 20,
  opacity: 0.9,
  marginRight: theme.spacing(1),
}));

interface Props {
  error: any;
}

const LoginDialogFormError = memo(({ error }: Props) => {
  return (
    <StyledSnackbarContent
      message={
        <Box alignItems="center" data-testid="error" display="flex">
          <StyledErrorIcon />
          {error.message}
        </Box>
      }
    />
  );
});

export default LoginDialogFormError;
