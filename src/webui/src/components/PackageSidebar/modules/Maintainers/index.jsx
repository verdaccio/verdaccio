import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import filter from 'lodash/filter';
import size from 'lodash/size';
import uniqBy from 'lodash/uniqBy';
import Module from '../../Module';

import classes from './style.scss';
import MaintainerInfo from './MaintainerInfo';

export default class Maintainers extends React.Component {
  static propTypes = {
    packageMeta: PropTypes.object.isRequired
  };

  state = {};

  constructor(props) {
    super(props);
    this.handleShowAllContributors = this.handleShowAllContributors.bind(this);
  }

  get author() {
    return get(this, 'props.packageMeta.latest.author');
  }

  get contributors() {
    let contributors = get(this, 'props.packageMeta.latest.contributors', {});
    return filter(contributors, (contributor) => {
      return (
        contributor.name !== get(this, 'author.name') &&
        contributor.email !== get(this, 'author.email')
      );
    });
  }

  get showAllContributors() {
    return this.state.showAllContributors || size(this.contributors) <= 5;
  }

  get uniqueContributors() {
    if (!this.contributors) {
      return [];
    }

    return uniqBy(this.contributors, (contributor) => contributor.name).slice(0, 5);
  }

  handleShowAllContributors() {
    this.setState({
      showAllContributors: true
    });
  }

  renderContributors() {
    if (!this.contributors) return null;

    return (this.showAllContributors ? this.contributors : this.uniqueContributors)
      .map((contributor, index) => {
        return <MaintainerInfo
          key={index}
          title="Contributors"
          name={contributor.name}
          avatar={contributor.avatar}/>;
      });
  }

  render() {
    let author = this.author;

    // There is no author info on `package.json`
    if (!author.name) {
      return null;
    }

    return (
      <Module
        title="Maintainers"
        className={classes.maintainersModule}
      >
        <ul className="maintainer-author">
          {author && <MaintainerInfo title="Author" name={author.name} avatar={author.avatar}/>}
          {this.renderContributors()}
        </ul>
        {!this.showAllContributors && (
          <button
            onClick={this.handleShowAllContributors}
            className={classes.showAllContributors}
            title="Current list only show the author and first 5 contributors unique by name"
          >
            Show all contributor
          </button>
        )}
      </Module>
    );
  }
}
