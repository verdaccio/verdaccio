import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import API from '../../../utils/api';

import classes from './style.scss';
import getRegistryURL from '../../../utils/getRegistryURL';

export default class PackageSidebar extends React.Component {
  state = {
    lastUpdate: 'Loading',
    recentReleases: [],
    author: null,
    contributors: null,
    showAllContributors: false,
    dependencies: {}
  };

  constructor(props) {
    super(props);
    this.showAllContributors = this.showAllContributors.bind(this);
  }

  async componentDidMount() {
    await this.loadPackageData(this.props.packageName);
  }

  async componentWillReceiveProps(newProps) {
    if (newProps.packageName !== this.props.packageName) {
      await this.loadPackageData(newProps.packageName);
    }
  }

  async loadPackageData(packageName) {
    let packageMeta;

    try {
      packageMeta = (await API.get(`sidebar/${packageName}`)).data;
    } catch (err) {
      this.setState({
        failed: true
      });
      return;
    }

    let lastUpdate = 0;
    Object.keys(packageMeta._uplinks).forEach((upLinkName) => {
      const status = packageMeta._uplinks[upLinkName];

      if (status.fetched > lastUpdate) {
        lastUpdate = status.fetched;
      }
    });

    let recentReleases = Object.keys(packageMeta.time).map((version) => {
      return {
        version,
        time: packageMeta.time[version]
      };
    });
    recentReleases = recentReleases.slice(recentReleases.length - 3, recentReleases.length).reverse();

    this.setState({
      lastUpdate: lastUpdate ? (new Date(lastUpdate)).toLocaleString() : '',
      recentReleases,
      author: packageMeta.latest.author,
      contributors: packageMeta.latest.contributors,
      dependencies: packageMeta.latest.dependencies,
      showAllContributors: _.size(packageMeta.latest.contributors) <= 5
    });
  }

  showAllContributors() {
    this.setState({
      showAllContributors: true
    });
  }

  render() {
    let {author, contributors, recentReleases, lastUpdate, showAllContributors, dependencies} = this.state;

    let uniqueContributors = [];
    if (contributors) {
      uniqueContributors = _.filter(_.uniqBy(contributors, (contributor) => contributor.name), (contributor) => {
        return contributor.name !== _.get(author, 'name');
      })
        .slice(0, 5);
    }

    return (
      <aside>
        <Module
          title="Last Sync"
          description={lastUpdate}
          className={classes.releasesModule}
        >
          <ul>
            {recentReleases.length > 0 && recentReleases.map((versionInfo) => {
              return (
                <li key={versionInfo.version}>
                  <span>{versionInfo.version}</span>
                  <span>{(new Date(versionInfo.time)).toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        </Module>

        <Module
          title="Maintainers"
          className={classes.authorsModule}
        >
          <ul>
            {author && <MaintainerInfo title="Author" name={author.name} avatar={author.avatar}/>}
            {contributors && (showAllContributors ? contributors : uniqueContributors).map((contributor, index) => {
              return <MaintainerInfo key={index} title="Contributors" name={contributor.name} avatar={contributor.avatar}/>;
            })}
          </ul>
          {!this.state.showAllContributors && (
            <button
              onClick={this.showAllContributors}
              className={classes.showAllContributors}
              title="Current list only show the author and first 5 contributors unique by name"
            >
              Show all contributor
            </button>
          )}
        </Module>

        {/* Package management module? Help us implement it! */}

        <Module
          title="Dependencies"
          className={classes.dependenciesModule}
        >
          <ul>
            {_.size(dependencies) ? (
              Object.keys(dependencies).map((dependenceName, index) => {
                return (
                  <li key={index} title={`Depend on version: ${dependencies[dependenceName]}`}>
                    <a href={`${getRegistryURL()}/#/detail/${dependenceName}`} target="_blank">{dependenceName}</a>
                    {index + 1 < _.size(dependencies) && <span>,&nbsp;</span>}
                  </li>
                );
             })
            ): <p className={classes.emptyPlaceholder}>Zero dependencies</p>}
          </ul>
        </Module>
      </aside>
    );
  }
}
PackageSidebar.propTypes = {
  packageName: PropTypes.string.isRequired
};

function Module(props) {
  return (
    <div className={`${classes.module} ${props.className}`}>
      <h2 className={classes.moduleTitle}>
        {props.title}
        {props.description && <span>{props.description}</span>}
      </h2>
      <div>
        {props.children}
      </div>
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.any.isRequired,
  className: PropTypes.string
};

function MaintainerInfo(props) {
  let avatarDescription = `${props.title} ${props.name}'s avatar`;
  return (
    <div className={classes.maintainer} title={props.name}>
      <img src={props.avatar} alt={avatarDescription} title={avatarDescription}/>
      <span>{props.name}</span>
    </div>
  );
}
MaintainerInfo.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired
};
