import React from 'react';
import PropTypes from 'prop-types';
import {Tag} from 'element-react';
import {Link} from 'react-router-dom';

import {formatDateDistance} from '../../utils/package';

import classes from './package.scss';

const Package = ({name, version, author, description, license, time}) => {
  return (<section className={classes.package}>
    <Link to={`detail/${name}`}>
      <div className={classes.header}>
        <div className={classes.title}>
          <h1>
            {name} <Tag type="gray">v{version}</Tag>
          </h1>
        </div>
        <div role="author" className={classes.author}>
        { author ? `By: ${author}`: ''}
        </div>
      </div>
      <div className={classes.footer}>
        <p className={classes.description}>
          {description}
        </p>
      </div>
      <div className={classes.details}>
        <div className={classes.homepage}>
          {time ? `Published ${formatDateDistance(time)} ago` : ''}
        </div>
        <div className={classes.license}>
          {license}
        </div>
      </div>
    </Link>
  </section>);
};

Package.propTypes = {
  name: PropTypes.string,
  version: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  license: PropTypes.string,
  time: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ])
};

export default Package;
