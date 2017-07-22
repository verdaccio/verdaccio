import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Package from '../Package';
import Help from '../Help';

import classes from './packageList.scss';

export default class PackageList extends React.Component {

  static propTypes = {
    packages: PropTypes.array
  }

  render() {
    return (
      <div>
        <div className={classes.pkgContainer}>
          {this.renderTitle()}
          {this.isTherePackages() ? this.renderList(): this.renderHelp()}
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

  renderList() {
    return this.props.packages.map((pkg, i)=> (
      <li key={i}><Package package={pkg} /></li>
    ));
  }

  renderHelp() {
    return <Help/>;
  }

  isTherePackages() {
    return isEmpty(this.props.packages) === false;
  }
}
