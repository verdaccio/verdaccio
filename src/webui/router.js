import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import {asyncComponent} from './utils/asyncComponent';

const DetailPackage = asyncComponent(() => import('./pages/detail'));
const HomePage = asyncComponent(() => import('./pages/home'));

class RouterApp extends Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool,
    packages: PropTypes.array
  };

  render() {
    const {isUserLoggedIn, packages} = this.props;
    return (
      <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <HomePage isUserLoggedIn={isUserLoggedIn} packages={packages} />
              )}
            />
            <Route
              exact
              path="/detail/@:scope/:package"
              render={(props) => (
                <DetailPackage {...props} isUserLoggedIn={isUserLoggedIn} />
              )}
            />
            <Route
              exact
              path="/detail/:package"
              render={(props) => (
                <DetailPackage {...props} isUserLoggedIn={isUserLoggedIn} />
              )}
            />
          </Switch>
      </Router>
    );
  }
}

export default RouterApp;
