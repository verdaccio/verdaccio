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
    const { onClick, onSuggestionsFetch, onCleanSuggestions, searchPackages, packages, ...others } = this.props;
    return (
      <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <HomePage 
                  {...others}
                  onClick={onClick}
                  onSuggestionsFetch={onSuggestionsFetch}
                  onCleanSuggestions={onCleanSuggestions}
                  searchPackages={searchPackages}
                  packages={packages}
                />
              )}
            />
            <Route
              exact
              path="/detail/@:scope/:package"
              render={(props) => (
                <DetailPackage {...props} {...others} />
              )}
            />
            <Route
              exact
              path="/detail/:package"
              render={(props) => (
                <DetailPackage {...props} {...others} />
              )}
            />
          </Switch>
      </Router>
    );
  }
}

export default RouterApp;
