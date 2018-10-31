import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import {asyncComponent} from './utils/asyncComponent';

const DetailPackage = asyncComponent(() => import('./pages/detail'));
import HomePage from './pages/home';

class RouterApp extends Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool
  };

  render() {
    return (
      <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <HomePage {...this.props} />
              )}
            />
            <Route
              exact
              path="/detail/@:scope/:package"
              render={(props) => (
                <DetailPackage {...props} {...this.props} />
              )}
            />
            <Route
              exact
              path="/detail/:package"
              render={(props) => (
                <DetailPackage {...props} {...this.props} />
              )}
            />
          </Switch>
      </Router>
    );
  }
}

export default RouterApp;
