import { default as MaterialUITab, TabProps } from '@mui/material/Tab';
import React, { forwardRef } from 'react';

type TabRef = HTMLButtonElement;

const Tab = forwardRef<TabRef, TabProps>(function Tab(props, ref) {
  return <MaterialUITab {...props} innerRef={ref} />;
});

export default Tab;
