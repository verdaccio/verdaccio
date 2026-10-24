import Box from '@mui/material/Box';
import React from 'react';
import { useSearchParams } from 'react-router';

import Deprecated from '../../components/Deprecated';
import { useConfig, useVersion } from '../../providers';
import ContainerContent, { TabPosition } from './ContainerContent';
import Tabs from './Tabs';

export { TabPosition };

export const TAB_SEARCH_PARAM = 'tab';

const DetailContainer: React.FC = () => {
  const { configOptions } = useConfig();
  const tabs = configOptions.showUplinks
    ? Object.values(TabPosition)
    : Object.values(TabPosition).filter((tab) => tab !== TabPosition.UPLINKS);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get(TAB_SEARCH_PARAM) as TabPosition | null;
  const tabPosition =
    requestedTab && tabs.includes(requestedTab) ? requestedTab : TabPosition.README;
  const { readMe, packageMeta } = useVersion();

  const handleChange = (_event: React.SyntheticEvent, newValue: TabPosition) => {
    setSearchParams((params) => {
      if (newValue === TabPosition.README) {
        params.delete(TAB_SEARCH_PARAM);
      } else {
        params.set(TAB_SEARCH_PARAM, newValue);
      }
      return params;
    });
  };

  return (
    <Box component="div" display="flex" flexDirection="column" minWidth={0} padding={0}>
      <Tabs
        onChange={handleChange}
        showUplinks={configOptions.showUplinks}
        tabPosition={tabPosition}
      />
      {packageMeta?.latest?.deprecated && <Deprecated message={packageMeta?.latest?.deprecated} />}
      <ContainerContent readDescription={readMe} tabPosition={tabPosition} />
    </Box>
  );
};

export default DetailContainer;
