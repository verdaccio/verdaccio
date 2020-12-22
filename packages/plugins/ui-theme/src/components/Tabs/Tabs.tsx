import { default as MaterialUITabs, TabsProps } from '@material-ui/core/Tabs';
import React, { forwardRef } from 'react';

type TabsRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

interface Props extends Omit<TabsProps, 'onChange'> {
  onChange: (event: React.ChangeEvent<{}>, value: number) => void;
}

const Tabs = forwardRef<TabsRef, Props>(function Tabs(props, ref) {
  return <MaterialUITabs {...props} innerRef={ref} />;
});

export default Tabs;
