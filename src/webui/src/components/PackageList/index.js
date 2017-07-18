import React from 'react';
import PropTypes from 'prop-types';

import classes from './packageList.scss';

import Package from '../Package';

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
        <div className={classes.pkgContainer}>
          {
            this.props.packages.length ?
                this.renderList():
                <li className={classes.noPkg}>No Package Available</li>
          }
        </div>
    );
  }
}
