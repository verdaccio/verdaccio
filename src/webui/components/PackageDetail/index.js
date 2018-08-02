import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Readme from '../Readme';

import classes from './packageDetail.scss';

const displayState = (readMe) => {
  return !isNil(readMe) ? <Readme readMe={readMe} /> : '';
};

const PackageDetail = ({packageName, readMe}) => {
  return (
    <div className={classes.pkgDetail}>
      <h1 className={classes.title}>{packageName}</h1>
      <div className={classes.readme}>{displayState(readMe)}</div>
    </div>
  );
};

PackageDetail.propTypes = {
  readMe: PropTypes.string,
  packageName: PropTypes.string.isRequired
};

export default PackageDetail;
