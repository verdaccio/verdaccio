import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import AppConfigurationContext from 'verdaccio-ui/providers/config';

import App from './App';
import StyleBaseline from './design-tokens/StyleBaseline';
import ThemeProvider from './design-tokens/ThemeProvider';
import { store } from './store';

const rootNode = document.getElementById('root');
const renderApp = (Component: React.ElementType): void => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <AppConfigurationContext>
          <ThemeProvider>
            <StyleBaseline />
            <Component />
          </ThemeProvider>
        </AppConfigurationContext>
      </AppContainer>
    </Provider>,
    rootNode
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp(App);
  });
}
