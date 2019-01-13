import React from 'react';
import propTypes from 'prop-types';
import Module from '../../Module';
import ModuleContentPlaceholder from '../../ModuleContentPlaceholder';

import classes from './style.scss';

const renderDistTags = (distTags) => {

  const tags = Object.entries(distTags);

  return (
    <ul>
      {tags.map((tagItem) => {
        const [tag, version] = tagItem;

        return (
          <li className={'dist-tag-item'} key={tag}>
            <span>{tag}</span>
            <span>{version}</span>
          </li>
        );
      })}
    </ul>
  );
};

const DistTags = ({distTags = {}}) => {
  const hasTags = Object.keys(distTags).length > 0;

  return (
    <Module
      className={classes.releasesModule}
      description={''}
      title={'Dist-Tags'}
    >
      {hasTags ? (
        renderDistTags(distTags)
      ) : (
        <ModuleContentPlaceholder text={'Not Available!'} />
      )}
    </Module>
  );
};

DistTags.propTypes = {
  distTags: propTypes.object,
};

export default DistTags;
