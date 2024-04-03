/* eslint-disable react/forbid-component-props */

/* eslint-disable verdaccio/jsx-no-style */
import styled from '@emotion/styled';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Theme } from '../..';
import Heading from '../Heading';

const Foebidden: React.FC = () => {
  const history = useHistory();

  const { t } = useTranslation();

  const handleGoHome = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <Box
      alignItems="center"
      data-testid="404"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      justifyContent="center"
      p={2}
    >
      <Container>
        <LockIcon color="primary" style={{ fontSize: 236 }} />
      </Container>
      <StyledHeading className="not-found-text" variant="h4">
        {t('error.401.sorry-no-access')}
      </StyledHeading>
      <Button data-testid="not-found-go-to-home-button" onClick={handleGoHome} variant="contained">
        {t('button.go-to-the-home-page')}
      </Button>
    </Box>
  );
};

export default Foebidden;

const Container = styled('div')({
  margin: '0 auto',
});

const StyledHeading = styled(Heading)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.white,
  marginBottom: 16,
}));
