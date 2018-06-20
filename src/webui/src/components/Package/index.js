import React from 'react';
import PropTypes from 'prop-types';
import {Tag} from 'element-react';
import {Link} from 'react-router-dom';
import isNil from 'lodash/isNil';
import {formatDateDistance} from '../../utils/DateUtils';

import classes from './package.scss';

export default class Package extends React.Component {
  static propTypes = {
    package: PropTypes.object
  }

  render() {
    const {package: pkg} = this.props;

    return (
      <section className={classes.package}>
        <Link to={`detail/${pkg.name}`}>
          <div className={classes.header}>
            {this.renderTitle(pkg)}
            {this.renderAuthor(pkg)}
          </div>
          <div className={classes.footer}>
            {this.renderDescription(pkg)}
          </div>
          <div className={classes.details}>
            {this.renderPublished(pkg)}
            {this.renderLicense(pkg)}
          </div>
        </Link>
      </section>
    );
  }

  renderPublished(pkg) {
      return (<div className={classes.homepage}>
        {pkg.time ? `Published ${formatDateDistance(pkg.time)} ago`: ''}
      </div>);
  }

  renderLicense(pkg) {
    if (pkg.license) {
      return (<div className={classes.license}>
        {pkg.license}
      </div>);
    }

    return null;
  }

  renderDescription(pkg) {
    return (
      <p className={classes.description}>
        {pkg.description}
      </p>
    );
  }

  renderTitle(pkg) {
    return (
      <div className={classes.title}>
        <h1>
          {pkg.name} {this.renderTag(pkg)}
        </h1>
      </div>
    );
  }

  renderTag(pkg) {
    return <Tag type="gray">v{pkg.version}</Tag>;
  }

  renderAuthor(pkg) {
    if (isNil(pkg.author) || isNil(pkg.author.name)) {
      return;
    }

    return <div role="author" className={classes.author}>{`By: ${pkg.author.name}`}</div>;
  }
}
