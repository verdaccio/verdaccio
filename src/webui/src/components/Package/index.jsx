import React from 'react';
import PropTypes from 'prop-types';
import {Tag} from 'element-react';
import {Link} from 'react-router-dom';

import classes from './package.scss'
export default class Package extends React.Component {
  static propTypes = {
    package: PropTypes.object
  }

  render () {
    let {package: pkg} = this.props;

    return (
        <Link to={`detail/${pkg.name}`} className={classes.package}>
          <h1>{pkg.name}<Tag type="gray">v{pkg.version}</Tag></h1>
          <span role="author" className={classes.author}>By: {pkg.author.name}</span>
          <p>{pkg.description}</p>
        </Link>
    );
  }
}
