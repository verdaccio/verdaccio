import styled from '@emotion/styled';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { common } from '@mui/material/colors';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { Theme } from '../../';
import Heading from '../Heading';

const GenericError: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Box
      alignItems="center"
      data-testid="generic-error"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      justifyContent="center"
      p={2}
    >
      <Container>
        <ErrorOutlineIcon color="primary" style={{ fontSize: 236 }} />
      </Container>
      <StyledHeading className="generic-error-text" variant="h4">
        {t('error.unspecific')}
      </StyledHeading>
      <Button
        data-testid="generic-error-go-to-home-button"
        onClick={handleGoHome}
        variant="contained"
      >
        {t('button.go-to-the-home-page')}
      </Button>
    </Box>
  );
};

export default GenericError;

const Container = styled('div')({
  margin: '0 auto',
});

const StyledHeading = styled(Heading)<{ theme?: Theme }>(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.main : common.white,
  marginBottom: 16,
}));
