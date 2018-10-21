import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import PackageList from '../../components/PackageList';

class Home extends Component {
  static propTypes = {
    children: PropTypes.element,
    isUserLoggedIn: PropTypes.bool
  };

  state = {
    fistTime: true
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.packages !== prevState.packages) {
      return {
        packages: nextProps.packages,
      };
    }
    return null;
  }

  isTherePackages() {
    return isEmpty(this.state.packages);
  }

  render() {
    const { packages } = this.state;
    return (
      <div className="container content">
        <PackageList help={isEmpty(packages) === true} packages={packages} />
      </div>
    );
  }
}

export default Home;
