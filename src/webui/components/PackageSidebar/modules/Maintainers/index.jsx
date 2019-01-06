import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import filter from 'lodash/filter';
import size from 'lodash/size';
import has from 'lodash/has';
import uniqBy from 'lodash/uniqBy';

import Module from '../../Module';
import MaintainerInfo from './MaintainerInfo';
import ModuleContentPlaceholder from '../../ModuleContentPlaceholder';

import classes from './style.scss';

const CONTRIBUTORS_TO_SHOW = 5;

export default class Maintainers extends React.Component {
  static propTypes = {
    packageMeta: PropTypes.object.isRequired,
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
    const contributors = get(this, 'props.packageMeta.latest.contributors', {});
    return filter(contributors, (contributor) => {
      return (
        contributor.name !== get(this, 'author.name') &&
        contributor.email !== get(this, 'author.email')
      );
    });
  }

  get showAllContributors() {
    const { showAllContributors } = this.state;
    return showAllContributors || size(this.contributors) <= 5;
  }

  get uniqueContributors() {
    if (!this.contributors) {
      return [];
    }

    return uniqBy(this.contributors, (contributor) => contributor.name).slice(
      0,
      CONTRIBUTORS_TO_SHOW
    );
  }

  handleShowAllContributors() {
    this.setState({
      showAllContributors: true,
    });
  }

  renderContributors() {
    if (!this.contributors) return null;

    return (this.showAllContributors
      ? this.contributors
      : this.uniqueContributors
    ).map((contributor, index) => {
      return (
        <MaintainerInfo
          avatar={contributor.avatar}
          key={index}
          name={contributor.name}
          title={'Contributors'}
        />
      );
    });
  }

  renderAuthorAndContributors(author) {
    return (
      <div>
        <ul className={'maintainer-author'}>
          {author &&
            author.name && (
              <MaintainerInfo
                avatar={author.avatar}
                name={author.name}
                title={'Author'}
              />
            )}
          {this.renderContributors()}
        </ul>
        {!this.showAllContributors && (
          <button
            className={classes.showAllContributors}
            onClick={this.handleShowAllContributors}
            title={'Current list only show the author and first 5 contributors unique by name'}
          >
            {'Show all contributor'}
          </button>
        )}
      </div>
    );
  }

  render() {
    const contributors = this.renderContributors();
    return (
      <Module className={classes.maintainersModule} title={'Maintainers'}>
        {contributors.length || has(this.author, 'name') ? (
          this.renderAuthorAndContributors(this.author)
        ) : (
          <ModuleContentPlaceholder text={'Not Available!'} />
        )}
      </Module>
    );
  }
}
