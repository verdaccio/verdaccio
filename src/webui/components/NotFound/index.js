
import React from 'react';
import PropTypes from 'prop-types';

import classes from './404.scss';

const NotFound = (props) => {
    return (
      <div className={`container content ${classes.notFound}`}>
        <h1>Error 404 - {props.pkg}</h1>
        <hr/>
        <p>
          Oops, The package you are trying to access does not exist.
        </p>
      </div>
    );
};

NotFound.propTypes = {
  pkg: PropTypes.string.isRequired
};

export default NotFound;
