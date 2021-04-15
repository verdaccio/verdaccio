import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import APIProvider from 'verdaccio-ui/providers/API/APIProvider';
import AppConfigurationContext from 'verdaccio-ui/providers/config';

import App from './App';
import StyleBaseline from './design-tokens/StyleBaseline';
import ThemeProvider from './design-tokens/ThemeProvider';

const rootNode = document.getElementById('root');
const renderApp = (Component: React.ElementType): void => {
  ReactDOM.render(
    <AppContainer>
      <AppConfigurationContext>
        <ThemeProvider>
          <StyleBaseline />
          <APIProvider>
            <Component />
          </APIProvider>
        </ThemeProvider>
      </AppConfigurationContext>
    </AppContainer>,
    rootNode
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp(App);
  });
}
