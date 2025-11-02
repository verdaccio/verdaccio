import React from 'react';
import { createRoot } from 'react-dom/client';

import {
  AppConfigurationProvider,
  AuthProvider,
  ErrorBoundary,
  PersistenceSettingProvider,
  StyleBaseline,
  ThemeProvider,
} from '@verdaccio/ui-components';

import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing');
}

const root = createRoot(container);

const AppContainer = () => (
  <AppConfigurationProvider>
    <ThemeProvider>
      <StyleBaseline />
      <PersistenceSettingProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistenceSettingProvider>
    </ThemeProvider>
  </AppConfigurationProvider>
);

root.render(<AppContainer />);
