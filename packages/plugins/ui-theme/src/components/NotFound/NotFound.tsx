import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Theme } from 'verdaccio-ui/design-tokens/theme';

import Box from '../Box';
import Button from '../Button';
import Heading from '../Heading';

import PackageImg from './img/package.svg';

const NotFound: React.FC = () => {
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
      p={2}>
      <EmptyPackage alt={t('error.404.page-not-found')} src={PackageImg} />
      <StyledHeading className="not-found-text" variant="h4">
        {t('error.404.sorry-we-could-not-find-it')}
      </StyledHeading>
      <Button data-testid="not-found-go-to-home-button" onClick={handleGoHome} variant="contained">
        {t('button.go-to-the-home-page')}
      </Button>
    </Box>
  );
};

export default NotFound;

const EmptyPackage = styled('img')({
  width: '150px',
  margin: '0 auto',
});

const StyledHeading = styled(Heading)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.type === 'light' ? theme?.palette.primary.main : theme?.palette.white,
  marginBottom: 16,
}));
