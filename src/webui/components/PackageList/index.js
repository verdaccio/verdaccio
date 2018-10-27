import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

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

  renderPackges = () => {
    const { packages } = this.props;
    return (
      packages.length > 0 ? (
        <Fragment>
          <h1 className={classes.listTitle}>Available Packages</h1>
          {this.renderList()}
        </Fragment>
      ) : (
        <NoItems
          className="package-no-items"
          text={'No items were found with that query'}
        />
      )
    );
  }

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
          {help ? <Help /> : this.renderPackges()}
        </div>
      </div>
    );
  }
}
