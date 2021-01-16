import React from 'react';

import loadable from '../../../App/utils/loadable';

import DetailContainerContentReadme from './DetailContainerContentReadme';
import { TabPosition } from './tabs';

const Versions = loadable(() => import(/* webpackChunkName: "Versions" */ './Versions'));
const UpLinks = loadable(() => import(/* webpackChunkName: "UpLinks" */ './UpLinks'));

const Dependencies = loadable(
  () => import(/* webpackChunkName: "Dependencies" */ './Dependencies')
);

interface Props {
  tabPosition: TabPosition;
  readDescription?: string;
}

const DetailContainerContent: React.FC<Props> = ({ tabPosition, readDescription }) => {
  switch (tabPosition) {
    case TabPosition.README:
      return <DetailContainerContentReadme description={readDescription} />;
    case TabPosition.UPLINKS:
      return <UpLinks />;
    case TabPosition.VERSIONS:
      return <Versions />;
    case TabPosition.DEPENDENCIES:
      return <Dependencies />;
    default:
      return null;
  }
};

export default DetailContainerContent;
