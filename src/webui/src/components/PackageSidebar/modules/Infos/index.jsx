import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Module from '../../Module';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';

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
    if (isString(infoObj)) {
      return {url: infoObj};
    } else if (isEmpty(infoObj)) {
      return {url: ''};
    }

    infoObj.url = this.normalizeGitUrl(infoObj.url);

    return infoObj;
  }

  normalizeGitUrl(gitUrl) {
    return gitUrl ? gitUrl.replace(/^git\+/, '') : '';
  }

  render() {
    const infos = this.infos;

    if (infos.homepage.url === '' && infos.repo.url === '' && infos.license === 'N/A') {
      return '';
    }

    return (
      <Module
        title="Infos"
        className={classes.infosModule}
      >
        <ul>
          {infos.homepage.url && this.renderSection('Homepage', infos.homepage.url)}

          {infos.repo.url && this.renderSection('Repository', infos.repo.url)}

          {infos.license &&
            <li><span>License</span><span>{infos.license}</span></li>
          }
        </ul>
      </Module>
    );
  }

  renderSection(title, url) {
    return (
      <li><span>{title}</span><a href={url} target="_blank">{url}</a></li>
    );
  }
}
