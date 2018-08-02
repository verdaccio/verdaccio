import React from 'react';
import PropTypes from 'prop-types';

import classes from './noItems.scss';

const NoItems = (props) => {
    return (
      <div className={classes.noItems}>
        <h2>{props.text}</h2>
      </div>
    );
};

NoItems.propTypes = {
  text: PropTypes.string.isRequired
};

export default NoItems;
