import './utils/__setPublicPath__';

import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from './app';

let rootNode = document.getElementById('root');

let renderApp = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
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
