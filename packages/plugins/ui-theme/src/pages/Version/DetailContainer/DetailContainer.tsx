import React, { useState, useContext } from 'react';

import Box from 'verdaccio-ui/components/Box';

import { DetailContext } from '../context';

import Deprecated from './Deprecated';
import DetailContainerContent from './DetailContainerContent';
import DetailContainerTabs from './DetailContainerTabs';
import { TabPosition } from './tabs';

const DetailContainer: React.FC = () => {
  const tabs = Object.values(TabPosition);
  const [tabPosition, setTabPosition] = useState(0);
  const detailContext = useContext(DetailContext);
  const { readMe, packageMeta } = detailContext;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabPosition(newValue);
  };

  return (
    <Box component="div" display="flex" flexDirection="column" padding={2}>
      <DetailContainerTabs onChange={handleChange} tabPosition={tabPosition} />
      {packageMeta?.latest?.deprecated && <Deprecated message={packageMeta?.latest?.deprecated} />}
      <DetailContainerContent readDescription={readMe} tabPosition={tabs[tabPosition]} />
    </Box>
  );
};

export default DetailContainer;
