/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContextConsumer } from './app';

import { asyncComponent } from './utils/asyncComponent';

const DetailPackage = asyncComponent(() => import('./pages/detail'));
const VersionPackage = asyncComponent(() => import('./pages/version'));
const HomePage = asyncComponent(() => import('./pages/home'));

interface IProps {
  isUserLoggedIn: boolean;
  packages: Array<Object>;
}

interface IState {}

class RouterApp extends Component<IProps, IState> {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path={'/'} render={this.renderHomePage} />
          <Route exact={true} path={'/detail/@:scope/:package'} render={this.renderDetailPage} />
          <Route exact={true} path={'/detail/:package'} render={this.renderDetailPage} />
          <Route exact={true} path={'/version/@:scope/:package'} render={this.renderVersionPage} />
          <Route exact={true} path={'/version/:package'} render={this.renderVersionPage} />
        </Switch>
      </Router>
    );
  }

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
