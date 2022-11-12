import React from 'react';
import { createRoot } from 'react-dom/client';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import AppConfigurationContext from 'verdaccio-ui/providers/config';

import App from './App';
import StyleBaseline from './design-tokens/StyleBaseline';
import ThemeProvider from './design-tokens/ThemeProvider';
import { store } from './store';

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

const AppContainer = () => (
  <Provider store={store}>
    <AppConfigurationContext>
      <ThemeProvider>
        <StyleBaseline />
        <App />
      </ThemeProvider>
    </AppConfigurationContext>
  </Provider>
);

root.render(<AppContainer />);

// @ts-expect-error
if (module.hot) {
  hot(AppContainer);
}
