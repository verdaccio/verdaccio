import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';

import { formatDateDistance } from '../../utils/package';

import classes from './package.scss';

const Package = ({ name, version, author, description, license, time, keywords }) => {
  return (<section className={classes.package}>
    <Link to={`detail/${name}`}>
      <div className={classes.header}>
        <div className={classes.title}>
          <h1>
            {name} <Chip label={`v${version}`} />
          </h1>
        </div>
        <div role="author" className={classes.author}>
          {author ? `By: ${author}` : ''}
        </div>
      </div>
      <div className={classes.footer}>
        <p className={classes.description}>
          {description}
        </p>
      </div>
      <div className={classes.tags}>
        {keywords && keywords.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword}
            className={classes.tag}
          />
        ))}
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
  keywords: PropTypes.array,
  license: PropTypes.string,
  time: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ])
};

export default Package;
