import React from 'react';
import PropTypes from 'prop-types';
import Module from '../../Module';

import {getDetailPageURL} from '../../../../utils/url';
import ModuleContentPlaceholder from '../../ModuleContentPlaceholder';

import classes from './style.scss';

const renderDependenciesList = (dependencies, dependenciesList) => {
  return (
    <ul>
      {dependenciesList.map((dependenceName, index) => {
        return (
          <li
            className="dependency-item"
            key={index}
            title={`Depend on version: ${dependencies[dependenceName]}`}
          >
            <a href={getDetailPageURL(dependenceName)}>{dependenceName}</a>
            {index < dependenciesList.length - 1 && <span>,&nbsp;</span>}
          </li>
        );
      })}
    </ul>
  );
};

const Dependencies = ({dependencies = {}}) => {
  const dependenciesList = Object.keys(dependencies);
  return (
    <Module title="Dependencies" className={classes.dependenciesModule}>
      {dependenciesList.length > 1 ? (
        renderDependenciesList(dependencies, dependenciesList)
      ) : (
        <ModuleContentPlaceholder text="Zero Dependencies!" />
      )}
    </Module>
  );
};

Dependencies.propTypes = {
  dependencies: PropTypes.object
};

export default Dependencies;
