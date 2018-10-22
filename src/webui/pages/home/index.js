import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PackageList from '../../components/PackageList';

class Home extends Component {
  static propTypes = {
    children: PropTypes.element,
    isUserLoggedIn: PropTypes.bool,
    packages: PropTypes.array,
    filteredPackages: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      fistTime: true,
      packages: props.packages,
      filteredPackages: props.filteredPackages
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.packages !== prevState.packages) {
      return {
        packages: nextProps.packages,
      };
    }
    if (nextProps.filteredPackages !== prevState.filteredPackages) {
      return {
        filteredPackages: nextProps.filteredPackages,
      };
    }
    return null;
  }
  
  render() {
    const { filteredPackages, packages } = this.state;
    return (
      <div className="container content">
        <PackageList help={!packages.length > 0} packages={filteredPackages} />
      </div>
    );
  }
}

export default Home;
