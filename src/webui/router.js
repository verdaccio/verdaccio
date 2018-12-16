/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { asyncComponent } from './utils/asyncComponent';

const DetailPackage = asyncComponent(() => import('./pages/detail'));
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
        </Switch>
      </Router>
    );
  }

  renderHomePage = () => {
    const { isUserLoggedIn, packages } = this.props;

    return <HomePage isUserLoggedIn={isUserLoggedIn} packages={packages} />;
  };

  renderDetailPage = (routerProps: any) => {
    const { isUserLoggedIn } = this.props;

    return <DetailPackage {...routerProps} isUserLoggedIn={isUserLoggedIn} />;
  };
}

export default RouterApp;
