import React from 'react';

import { useVersion } from '../../providers';
import loadable from '../../utils/loadable';
import ReadmeSection from './ReadmeSection';

export enum TabPosition {
  README = 'readme',
  DEPENDENCIES = 'dependencies',
  VERSIONS = 'versions',
  UPLINKS = 'uplinks',
}

const Versions = loadable(
  () => import(/* webpackChunkName: "Versions" */ '../../components/Versions')
);
const UpLinks = loadable(
  () => import(/* webpackChunkName: "UpLinks" */ '../../components/UpLinks')
);

const Dependencies = loadable(
  () => import(/* webpackChunkName: "Dependencies" */ '../../components/Dependencies')
);

interface Props {
  tabPosition: TabPosition;
  readDescription?: string;
}

const ContainerContent: React.FC<Props> = ({ tabPosition, readDescription }) => {
  const { packageMeta, packageName } = useVersion();
  switch (tabPosition) {
    case TabPosition.README:
      return <ReadmeSection description={readDescription} />;
    case TabPosition.UPLINKS:
      return <UpLinks packageMeta={packageMeta} />;
    case TabPosition.VERSIONS:
      return <Versions packageMeta={packageMeta} packageName={packageName} />;
    case TabPosition.DEPENDENCIES:
      return <Dependencies packageMeta={packageMeta} />;
    default:
      return null;
  }
};

export default ContainerContent;
