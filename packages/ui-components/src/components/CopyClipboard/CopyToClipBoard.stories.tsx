import React from 'react';

import CopyToClipBoard from './CopyToClipBoard';

export default {
  title: 'Components/Sidebar/CopyToClipBoard',
  component: CopyToClipBoard,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args: any) => <CopyToClipBoard {...args} />;

export const WithDefaultArgs: any = Template.bind({});
WithDefaultArgs.args = {
  text: `npm i -g verdaccio`,
  dataTestId: 'id',
  title: 'Copy this',
};

export const RegistryCommand: any = Template.bind({});
RegistryCommand.args = {
  text: 'npm config set registry http://localhost:4873/',
  dataTestId: 'id',
  title: 'npm config set registry http://localhost:4873/',
};

export const WithoutTooltip: any = Template.bind({});
WithoutTooltip.args = {
  text: 'npm publish --registry http://localhost:4873/',
  dataTestId: 'id',
};
