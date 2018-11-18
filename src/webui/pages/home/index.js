import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PackageList from '../../components/PackageList';

class Home extends Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool.isRequired,
    packages: PropTypes.array.isRequired,
  };
  
  render() {
    const { packages } = this.props;
    console.log(this.props);
    return (
      <div className="container content">
        <PackageList help={packages.length < 1} packages={packages} />
      </div>
    );
  }
}

export default Home;
