/**
 * @prettier
 */

import './utils/__setPublicPath__';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import { locale, messages } from './utils/locales';
import App from './app';

const rootNode = document.getElementById('root');

const renderApp = Component => {
  ReactDOM.render(
    <AppContainer>
      <IntlProvider locale={locale} messages={messages}>
        <Component />
      </IntlProvider>
    </AppContainer>,
    rootNode
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./app', () => {
    renderApp(App);
  });
}
