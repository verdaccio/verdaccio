import React from 'react';
import PropTypes from 'prop-types';

import classes from './style.scss';

export default function Module({title, description, children, className}) {
  return (
    <div className={`${classes.module} ${className}`}>
      <h2 className={classes.moduleTitle}>
        {title}
        {description && <span>{description}</span>}
      </h2>
      <div>
        {children}
      </div>
    </div>
  );
}

Module.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};
