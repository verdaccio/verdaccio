/* eslint-disable react/jsx-max-depth */
import styled from '@emotion/styled';
import React, { useEffect, Suspense } from 'react';
import { Router } from 'react-router-dom';

import Box from 'verdaccio-ui/components/Box';
import Loading from 'verdaccio-ui/components/Loading';
import loadDayJSLocale from 'verdaccio-ui/design-tokens/load-dayjs-locale';
import StyleBaseline from 'verdaccio-ui/design-tokens/StyleBaseline';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import AppRoute, { history } from './AppRoute';
import Footer from './Footer';
import Header from './Header';

import '../i18n/config';

const StyledBox = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme?.palette.background.default,
}));

const StyledBoxContent = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  [`@media screen and (min-width: ${theme?.breakPoints.container}px)`]: {
    maxWidth: theme?.breakPoints.container,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const App: React.FC = () => {
  useEffect(() => {
    loadDayJSLocale();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <StyleBaseline />
      <StyledBox display="flex" flexDirection="column" height="100%">
        <>
          <Router history={history}>
            <Header />
            <StyledBoxContent flexGrow={1}>
              <AppRoute />
            </StyledBoxContent>
          </Router>
          <Footer />
        </>
      </StyledBox>
    </Suspense>
  );
};

export default App;
