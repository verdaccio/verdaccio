/**
 * @prettier
 * @flow
 */

/* eslint  react/jsx-max-depth:0 */

import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { AppContextConsumer } from './app';

import { asyncComponent } from './utils/asyncComponent';
import history from './history';
import Header from './components/Header';

const DetailPackage = asyncComponent(() => import('./pages/detail'));
const VersionPackage = asyncComponent(() => import('./pages/version'));
const HomePage = asyncComponent(() => import('./pages/home'));

class RouterApp extends Component<any, any> {
  render() {
    return (
      <Router history={history}>
        <Fragment>
          {this.renderHeader()}
          <Switch>
            <Route exact={true} path={'/'} render={this.renderHomePage} />
            <Route exact={true} path={'/-/web/detail/@:scope/:package'} render={this.renderDetailPage} />
            <Route exact={true} path={'/-/web/detail/:package'} render={this.renderDetailPage} />
            <Route exact={true} path={'/-/web/version/@:scope/:package'} render={this.renderVersionPage} />
            <Route exact={true} path={'/-/web/version/:package'} render={this.renderVersionPage} />
          </Switch>
        </Fragment>
      </Router>
    );
  }

  renderHeader = () => {
    const { onLogout, onToggleLoginModal } = this.props;

    return (
      <AppContextConsumer>
        {function renderConsumerVersionPage({ logoUrl, scope, user }) {
          return <Header logo={logoUrl} onLogout={onLogout} onToggleLoginModal={onToggleLoginModal} scope={scope} username={user.username} />;
        }}
      </AppContextConsumer>
    );
  };

  renderHomePage = () => {
    return (
      <AppContextConsumer>
        {function renderConsumerVersionPage({ isUserLoggedIn, packages }) {
          return <HomePage isUserLoggedIn={isUserLoggedIn} packages={packages} />;
        }}
      </AppContextConsumer>
    );
  };

  renderDetailPage = (routerProps: any) => {
    return (
      <AppContextConsumer>
        {function renderConsumerVersionPage({ isUserLoggedIn }) {
          return <DetailPackage {...routerProps} isUserLoggedIn={isUserLoggedIn} />;
        }}
      </AppContextConsumer>
    );
  };

  renderVersionPage = (routerProps: any) => {
    return (
      <AppContextConsumer>
        {function renderConsumerVersionPage({ isUserLoggedIn }) {
          return <VersionPackage {...routerProps} isUserLoggedIn={isUserLoggedIn} />;
        }}
      </AppContextConsumer>
    );
  };
}

export default RouterApp;
