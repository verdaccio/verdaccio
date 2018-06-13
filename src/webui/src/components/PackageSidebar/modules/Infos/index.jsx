import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Module from '../../Module';

import classes from './style.scss';

export default class Infos extends React.Component {
  static propTypes = {
    packageMeta: PropTypes.object.isRequired
  };

  get infos() {
    const homepage = this.normalizeInfo(get(this, 'props.packageMeta.latest.homepage', null));
    const repo = this.normalizeInfo(get(this, 'props.packageMeta.latest.repository', null));
    const license = get(this, 'props.packageMeta.latest.license', 'N/A');

    return {homepage, repo, license};
  }

  normalizeInfo(infoObj) {
    if (typeof infoObj === 'string') {
      return {url: infoObj};
    } else if (infoObj === null) {
      return {url: ''};
    }

    infoObj.url = infoObj.url.replace(/^git\+/, '');

    return infoObj;
  }

  render() {
    const infos = this.infos;

    if (!infos.homepage.url && !infos.repo.url && infos.license === 'N/A') {
      return '';
    }

    return (
      <Module
        title="Infos"
        className={classes.infosModule}
      >
        <ul>
          {infos.homepage.url &&
            <li><span>Homepage</span><a href={infos.homepage.url} target="_blank">{infos.homepage.url}</a></li>
          }

          {infos.repo.url &&
            <li><span>Repository</span><a href={infos.repo.url} target="_blank">{infos.repo.url}</a></li>
          }

          {infos.license &&
            <li><span>License</span><span>{infos.license}</span></li>
          }
        </ul>
      </Module>
    );
  }
}
