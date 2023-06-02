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
