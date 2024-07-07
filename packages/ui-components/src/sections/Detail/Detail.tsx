import Box from '@mui/material/Box';
import React, { useState } from 'react';

import Deprecated from '../../components/Deprecated';
import { useConfig, useVersion } from '../../providers';
import ContainerContent from './ContainerContent';
import Tabs from './Tabs';

export enum TabPosition {
  README = 'readme',
  DEPENDENCIES = 'dependencies',
  VERSIONS = 'versions',
  UPLINKS = 'uplinks',
}

const DetailContainer: React.FC = () => {
  const { configOptions } = useConfig();
  const tabs = configOptions.showUplinks
    ? Object.values(TabPosition)
    : Object.values(TabPosition).filter((tab) => tab !== TabPosition.UPLINKS);
  const [tabPosition, setTabPosition] = useState(0);
  const { readMe, packageMeta } = useVersion();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabPosition(newValue);
  };

  return (
    <Box component="div" display="flex" flexDirection="column" padding={0}>
      <Tabs
        onChange={handleChange}
        showUplinks={configOptions.showUplinks}
        tabPosition={tabPosition}
      />
      {packageMeta?.latest?.deprecated && <Deprecated message={packageMeta?.latest?.deprecated} />}
      <ContainerContent readDescription={readMe} tabPosition={tabs[tabPosition]} />
    </Box>
  );
};

export default DetailContainer;
