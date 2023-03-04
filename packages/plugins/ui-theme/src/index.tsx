import React from 'react';
import { createRoot } from 'react-dom/client';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import {
  AppConfigurationProvider,
  StyleBaseline,
  ThemeProvider,
  store,
} from '@verdaccio/ui-components';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

const AppContainer = () => (
  <Provider store={store}>
    <AppConfigurationProvider>
      <ThemeProvider>
        <StyleBaseline />
        <App />
      </ThemeProvider>
    </AppConfigurationProvider>
  </Provider>
);

root.render(<AppContainer />);

// @ts-expect-error
if (module.hot) {
  hot(AppContainer);
}
