/* eslint-disable react/jsx-max-depth */
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import React, { Suspense, useEffect } from 'react';
import { Router } from 'react-router-dom';
import Loading from 'verdaccio-ui/components/Loading';
import StyleBaseline from 'verdaccio-ui/design-tokens/StyleBaseline';
import loadDayJSLocale from 'verdaccio-ui/design-tokens/load-dayjs-locale';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { useConfig } from 'verdaccio-ui/providers/config';

import '../i18n/config';
import AppRoute, { history } from './AppRoute';
import Footer from './Footer';
import Header from './Header';

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
  const { configOptions } = useConfig();

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
          {configOptions.showFooter && <Footer />}
        </>
      </StyledBox>
    </Suspense>
  );
};

export default App;
