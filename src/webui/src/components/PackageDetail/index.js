import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Readme from '../Readme';

import classes from './packageDetail.scss';

const PackageDetail = (props) => {

 const displayState = (readMe) => {
   if (isNil(readMe)) {
     return;
   }
   return <Readme readMe={readMe}/>;
 };

  return (
    <div className={classes.pkgDetail}>
      <h1 className={ classes.title }>{ props.package }</h1>
      <div className={classes.readme}>
        {displayState(props.readMe)}
      </div>
    </div>
  );
};

PackageDetail.propTypes = {
  readMe: PropTypes.string,
  package: PropTypes.string.isRequired
};

export default PackageDetail;
