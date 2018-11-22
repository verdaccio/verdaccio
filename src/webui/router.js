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
    const { isUserLoggedIn, packages } = this.props;
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={() => <HomePage isUserLoggedIn={isUserLoggedIn} packages={packages} />} />
          <Route exact path="/detail/@:scope/:package" render={props => <DetailPackage {...props} isUserLoggedIn={isUserLoggedIn} />} />
          <Route exact path="/detail/:package" render={props => <DetailPackage {...props} isUserLoggedIn={isUserLoggedIn} />} />
        </Switch>
      </Router>
    );
  }
}

export default RouterApp;
