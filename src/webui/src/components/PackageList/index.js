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
                <li className={classes.noPkg}>
                  <h1 className={classes.noPkgTitle}>No Package Published Yet</h1>
                  <p>
                    To publish your first package just:
                    <br/><br/>
                    <strong>1. Login</strong><br/>
                    <code>npm adduser --registry {location.origin}</code><br/>
                    <strong>2. Publish</strong><br/>
                    <code>npm publish --registry {location.origin}</code><br/>
                    <strong>3. Done!</strong>
                  </p>
                </li>
          }
        </div>
    );
  }
}
