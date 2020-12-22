import './utils/__setPublicPath__';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import StyleBaseline from './design-tokens/StyleBaseline';
import ThemeProvider from './design-tokens/ThemeProvider';

const rootNode = document.getElementById('root');

const renderApp = (Component: React.ElementType): void => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider>
        <StyleBaseline />
        <Component />
      </ThemeProvider>
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
