import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as FlagsIcon from 'country-flag-icons/react/3x2';
import React, { StrictMode, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { BrowserRouter, useLocation } from 'react-router';

import {
  ErrorBoundary,
  Footer,
  Header,
  HeaderInfoDialog,
  Loading,
  Route,
  SearchProvider,
  TranslatorProvider,
  breakPoints,
  useConfig,
} from '@verdaccio/ui-components';

import Contributors from '../components/Contributors';
import Support from '../components/Support';
import about from '../components/about.md';
import license from '../components/license.md';
import i18n from '../i18n/config';
import { listLanguages } from '../i18n/enabledLanguages';
import loadDayJSLocale from '../i18n/load-dayjs-locale';
import AppRoute from './AppRoute';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledBoxContent = styled(Box)({
  [`@media screen and (min-width: ${breakPoints.container}px)`]: {
    maxWidth: breakPoints.container,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const Flags = styled('span')(() => ({
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
      <SearchProvider>
        <Header HeaderInfoDialog={CustomInfoDialog} isPlainHeader={isPlainHeader} />
      </SearchProvider>
      <StyledBoxContent flexGrow={1}>
        <AppRoute />
      </StyledBoxContent>
      {configOptions.showFooter && <Footer />}
    </StyledBox>
  );
};

// @ts-ignore
const basename = window?.__VERDACCIO_BASENAME_UI_OPTIONS?.url_prefix;

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
            <BrowserRouter basename={basename}>
              <AppContent />
            </BrowserRouter>
          </Suspense>
        </TranslatorProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;
export { AppContent };
