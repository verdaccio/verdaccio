import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Package from '../Package';
import Help from '../Help';
import { formatAuthor, formatLicense } from '../../utils/package';

import classes from './packageList.scss';

export default class PackageList extends React.Component {
  static propTypes = {
    packages: PropTypes.array,
  };

  renderPackages = () => {
    return (
      <Fragment>
        {this.renderList()}
      </Fragment>
    );
  }

  renderList = () => {
    const { packages } = this.props;
    return (
      packages.map((pkg, i) => {
        const { name, version, description, time, keywords } = pkg;
        const author = formatAuthor(pkg.author);
        const license = formatLicense(pkg.license);
        return (
          <Package key={i} {...{ name, version, author, description, license, time, keywords }} />
        );
      })
    );
  }

  render() {
    return (
      <div className={"package-list-items"}>
        <div className={classes.pkgContainer}>
          {this.hasPackages() ? this.renderPackages(): <Help /> }
        </div>
      </div>
    );
  }

  hasPackages() {
    const {packages} = this.props;

    return packages.length > 0;
  }
}
