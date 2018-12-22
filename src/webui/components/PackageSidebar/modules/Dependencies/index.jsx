import React from 'react';
import PropTypes from 'prop-types';
import Module from '../../Module';

import {getDetailPageURL} from '../../../../utils/url';
import ModuleContentPlaceholder from '../../ModuleContentPlaceholder';

import classes from './style.scss';

export const NO_DEPENDENCIES = 'Zero Dependencies!';
export const DEP_ITEM_CLASS = 'dependency-item';

const renderDependenciesList = (dependencies, dependenciesList) => {
  return (
    <ul>
      {dependenciesList.map((dependenceName, index) => {
        return (
          <li
            className={DEP_ITEM_CLASS}
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

const Dependencies = ({dependencies = {}, title = 'Dependencies'}) => {
  const dependenciesList = Object.keys(dependencies);
  return (
    <Module title={title} className={classes.dependenciesModule}>
      {dependenciesList.length > 0 ? (
        renderDependenciesList(dependencies, dependenciesList)
      ) : (
        <ModuleContentPlaceholder text={NO_DEPENDENCIES} />
      )}
    </Module>
  );
};

Dependencies.propTypes = {
  dependencies: PropTypes.object,
  title: PropTypes.string
};

export default Dependencies;
