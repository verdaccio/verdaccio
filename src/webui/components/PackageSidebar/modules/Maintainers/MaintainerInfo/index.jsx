import React from 'react';
import PropTypes from 'prop-types';

import classes from './style.scss';

const MaintainerInfo = ({title, name, avatar}) => {
  const avatarDescription = `${title} ${name}'s avatar`;
  return (
    <div className={classes.maintainer} title={name}>
      <img alt={avatarDescription} src={avatar} title={avatarDescription} />
      <span className={'maintainer-name'}>{name}</span>
    </div>
  );
};

MaintainerInfo.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

export default MaintainerInfo;
