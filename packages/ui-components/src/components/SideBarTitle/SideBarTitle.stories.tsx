import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { default as SideBarTittle } from '.';

const meta: Meta<typeof SideBarTittle> = {
  title: 'Components/Sidebar/Title',
  component: SideBarTittle,
};

export default meta;

type Story = StoryObj<typeof SideBarTittle>;

export const Commonjs: Story = {
  name: 'CommonJS package',
  render: () => (
    <SideBarTittle
      isLatest={false}
      moduleTypes={['commonjs']}
      packageName="jquery"
      time="2012-12-31T06:54:14.275Z"
      version="1.0.0"
    />
  ),
};

export const ES6: Story = {
  name: 'ES6 package',
  render: () => (
    <SideBarTittle
      isLatest={true}
      moduleTypes={['module']}
      packageName="react"
      time="2012-12-31T06:54:14.275Z"
      version="14.0.0"
    />
  ),
};

export const CommonjsAndES6: Story = {
  name: 'CommonJS and ES6 package',
  render: () => (
    <SideBarTittle
      isLatest={true}
      moduleTypes={['commonjs', 'module']}
      packageName="jquery"
      time="2012-12-31T06:54:14.275Z"
      version="1.0.0"
    />
  ),
};

export const Description: Story = {
  name: 'With description',
  render: () => (
    <SideBarTittle
      description="Storybook's CLI - easiest method of adding storybook to your projects"
      isLatest={true}
      moduleTypes={['module']}
      packageName="storybook"
      time="2012-12-31T06:54:14.275Z"
      version="14.0.0"
    />
  ),
};

export const WithTypes: Story = {
  name: 'With types declaration',
  render: () => (
    <SideBarTittle
      description="Storybook's CLI - easiest method of adding storybook to your projects"
      hasTypes={true}
      isLatest={true}
      moduleTypes={['module']}
      packageName="storybook"
      time="2012-12-31T06:54:14.275Z"
      version="14.0.0"
    />
  ),
};
