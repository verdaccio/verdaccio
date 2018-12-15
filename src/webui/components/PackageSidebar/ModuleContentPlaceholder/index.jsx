import React from 'react';
import PropTypes from 'prop-types';

import classes from './style.scss';

export default function ModuleContentPlaceholder({text}) {
  return <p className={classes.emptyPlaceholder}>{text}</p>;
}
ModuleContentPlaceholder.propTypes = {
  text: PropTypes.string.isRequired,
};
