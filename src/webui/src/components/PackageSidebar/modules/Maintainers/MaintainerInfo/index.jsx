import React from 'react';
import PropTypes from 'prop-types';

import classes from './style.scss';

export default function MaintainerInfo({title, name, avatar, email}) {
  let avatarDescription = `${title} ${name}'s avatar`;
  let href= `mailto:${email}`;
  return (
    <div className={classes.maintainer} title={name}>
      <a href={href}>
        <img src={avatar} alt={avatarDescription} title={avatarDescription}/>
        <span className="maintainer-name">{name}</span>
      </a>
    </div>
  );
}
MaintainerInfo.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};
