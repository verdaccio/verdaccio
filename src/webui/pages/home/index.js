import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Header from '../../components/Header';

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
    const { searchPackages, ...others } = this.props;
    const { packages } = this.state;
    return (
      <Fragment>
        <Header {...others} packages={searchPackages}  />
        <div className="container content">
          <PackageList help={isEmpty(packages) === true} packages={packages} />
        </div>
      </Fragment>
    );
  }
}

export default Home;
