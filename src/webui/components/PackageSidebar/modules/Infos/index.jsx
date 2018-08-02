import React from 'react';
import PropTypes from 'prop-types';
import Module from '../../Module';
import ModuleContentPlaceholder from '../../ModuleContentPlaceholder';

import classes from './style.scss';

const renderSection = (title, url) => (
  <li>
    <span>{title}</span>
    <a href={url} target="_blank">
      {url}
    </a>
  </li>
);

const Infos = ({homepage, repository, license}) => {
  const showInfo = homepage || repository || license;
  return <Module title="Infos" className={classes.infosModule}>
      {showInfo ? <ul>
          {homepage && renderSection('Homepage', homepage)}
          {repository && renderSection('Repository', repository)}
          {license && <li>
              <span>License</span>
              <span>{license}</span>
            </li>}
        </ul> : <ModuleContentPlaceholder text="Not Available!" />}
    </Module>;
};

Infos.propTypes = {
  homepage: PropTypes.string,
  repository: PropTypes.string,
  license: PropTypes.string
};

export default Infos;
