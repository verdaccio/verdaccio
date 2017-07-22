import React from 'react';
import PropTypes from 'prop-types';

import Package from '../Package';
import Help from '../Help';

import classes from './packageList.scss';

export default class PackageList extends React.Component {

  static propTypes = {
    packages: PropTypes.array
  }

  renderList() {
    return this.props.packages.map((pkg, i)=> (
        <li key={i}><Package package={pkg} /></li>
    ));
  }

  render() {
    return (
      <div>
        <div className={classes.pkgContainer}>
          {this.renderTitle()}
          {this.props.packages.length ? this.renderList(): <Help/>}
        </div>
      </div>
    );
  }

  renderTitle() {
    if (this.isTherePackages() === false) {
      return;
    }

    return <h1 className={ classes.listTitle }>Available Packages</h1>;
  }

  isTherePackages() {
    return this.props.packages.length > 0;
  }
}
