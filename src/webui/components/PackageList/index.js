import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Package from '../Package';
import Help from '../Help';
import {formatAuthor, formatLicense} from '../../utils/package';

import classes from './packageList.scss';

export default class PackageList extends Component {
  static propTypes = {
    packages: PropTypes.array.isRequired,
    help: PropTypes.bool.isRequired
  };

  renderList = () => {
    const { packages } = this.props;
    return (
      <ul>
        {packages.map((pkg, i) => {
          const { label: name, version, description, time, keywords } = pkg;
          const author = formatAuthor(pkg.author);
          const license = formatLicense(pkg.license);
          return (
            <li key={i}>
              <Package {...{ name, version, author, description, license, time, keywords }} />
            </li>
          );
        })}
    </ul>
    );
  }

  render() {
    const { help } = this.props;
    return (
      <div className="package-list-items">
        <div className={classes.pkgContainer}>
          {help ? <Help /> : this.renderList()}
        </div>
      </div>
    );
  }
}
