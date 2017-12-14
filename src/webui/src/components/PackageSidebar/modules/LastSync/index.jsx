import React from 'react';
import PropTypes from 'prop-types';
import Module from '../../Module';

import classes from './style.scss';

export default class LastSync extends React.Component {
  static propTypes = {
    packageMeta: PropTypes.object.isRequired
  };

  get lastUpdate() {
    let lastUpdate = 0;
    Object.keys(this.props.packageMeta._uplinks).forEach((upLinkName) => {
      const status = this.props.packageMeta._uplinks[upLinkName];

      if (status.fetched > lastUpdate) {
        lastUpdate = status.fetched;
      }
    });

    return lastUpdate ? (new Date(lastUpdate)).toLocaleString() : '';
  }

  get recentReleases() {
    let recentReleases = Object.keys(this.props.packageMeta.time).map((version) => {
      return {
        version,
        time: new Date(this.props.packageMeta.time[version]).toLocaleString()
      };
    });

    return recentReleases.slice(recentReleases.length - 3, recentReleases.length).reverse();
  }

  render() {
    return (
      <Module
        title="Last Sync"
        description={this.lastUpdate}
        className={classes.releasesModule}
      >
        <ul>
          {this.recentReleases.map((versionInfo) => {
            return (
              <li key={versionInfo.version}>
                <span>{versionInfo.version}</span>
                <span>{versionInfo.time}</span>
              </li>
            );
          })}
        </ul>
      </Module>
    );
  }
}
