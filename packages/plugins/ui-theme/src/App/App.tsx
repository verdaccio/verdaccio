/* eslint-disable react/jsx-pascal-case */

/* eslint-disable react/jsx-max-depth */
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import * as FlagsIcon from 'country-flag-icons/react/3x2';
import React, { StrictMode, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Router, useLocation } from 'react-router-dom';

import {
  AuthProvider,
  AuthV1Provider,
  ErrorBoundary,
  Footer,
  Header,
  HeaderInfoDialog,
  Loading,
  Route,
  Theme,
  TranslatorProvider,
  useConfig,
} from '@verdaccio/ui-components';

import Contributors from '../components/Contributors';
import Support from '../components/Support';
import about from '../components/about.md';
import license from '../components/license.md';
import i18n from '../i18n/config';
import { listLanguages } from '../i18n/enabledLanguages';
import loadDayJSLocale from '../i18n/load-dayjs-locale';
import AppRoute, { history } from './AppRoute';

const StyledBox = styled(Box)<{ theme?: Theme }>(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
  };
});

const StyledBoxContent = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  [`@media screen and (min-width: ${theme.breakPoints.container}px)`]: {
    maxWidth: theme.breakPoints.container,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const Flags = styled('span')<{ theme?: Theme }>(() => ({
  width: '25px',
}));

function CustomInfoDialog({ onCloseDialog, title, isOpen }) {
  const { t } = useTranslation();
  return (
    <HeaderInfoDialog
      dialogTitle={title}
      isOpen={isOpen}
      onCloseDialog={onCloseDialog}
      tabPanels={[
        {
          element: (
            <>
              <ReactMarkdown>{about}</ReactMarkdown>
              <Contributors />
            </>
          ),
        },
        { element: <ReactMarkdown>{license}</ReactMarkdown> },
        { element: <Support /> },
      ]}
      tabs={[
        { label: t('about') },
        { label: t('dialog.license') },
        {
          label: '',
          icon: (
            <Flags>
              <FlagsIcon.UA />
            </Flags>
          ),
        },
      ]}
    />
  );
}

const AppContent: React.FC = () => {
  const { configOptions } = useConfig();
  const location = useLocation();
  const isPlainHeader = [
    Route.LOGIN,
    Route.SUCCESS,
    Route.ADD_USER,
    Route.CHANGE_PASSWORD,
  ].includes(location.pathname as Route);

  useEffect(() => {
    loadDayJSLocale();
  }, []);

  return (
    <StyledBox display="flex" flexDirection="column" height="100%">
      <Header HeaderInfoDialog={CustomInfoDialog} isPlainHeader={isPlainHeader} />
      <StyledBoxContent flexGrow={1}>
        <AppRoute />
      </StyledBoxContent>
      {configOptions.showFooter && <Footer />}
    </StyledBox>
  );
};

const App: React.FC = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <TranslatorProvider
          i18n={i18n}
          listLanguages={listLanguages}
          onMount={() => loadDayJSLocale}
        >
          <Suspense fallback={<Loading />}>
            <Router history={history}>
              <AppContent />
            </Router>
          </Suspense>
        </TranslatorProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;
