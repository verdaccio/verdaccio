import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Package from '../Package';
import Help from '../Help';
import NoItems from '../NoItems';
import {formatAuthor, formatLicense} from '../../utils/package';

import classes from './packageList.scss';

export default class PackageList extends React.Component {
  static propTypes = {
    packages: PropTypes.array,
    help: PropTypes.bool
  };

  render() {
    return (
      <div className="package-list-items">
        <div className={classes.pkgContainer}>
          {this.renderTitle()}
          {this.isTherePackages() ? this.renderList() : this.renderOptions()}
        </div>
      </div>
    );
  }

  renderTitle() {
    if (this.isTherePackages() === false) {
      return;
    }

    return <h1 className={classes.listTitle}>Available Packages</h1>;
  }

  renderList() {
    return this.props.packages.map((pkg, i) => {
      const {name, version, description, time} = pkg;
      const author = formatAuthor(pkg.author);
      const license = formatLicense(pkg.license);
      return (
        <li key={i}>
          <Package {...{name, version, author, description, license, time}} />
        </li>
      );
    });
  }

  renderOptions() {
    if (this.isTherePackages() === false && this.props.help) {
      return this.renderHelp();
    } else {
      return this.renderNoItems();
    }
  }

  renderNoItems() {
    return (
      <NoItems
        className="package-no-items"
        text={'No items were found with that query'}
      />
    );
  }

  renderHelp() {
    if (this.props.help === false) {
      return;
    }
    return <Help />;
  }

  isTherePackages() {
    return isEmpty(this.props.packages) === false;
  }
}
