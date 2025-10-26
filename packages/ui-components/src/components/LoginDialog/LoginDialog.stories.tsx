/* eslint-disable verdaccio/jsx-spread */
import React from 'react';
import { action } from 'storybook/actions';

import LoginDialog from './LoginDialog';

export default {
  title: 'Components/Dialog/LoginDialog',
};

export const OpenLoginDialog = {
  render: (args) => <LoginDialog {...args} />,
  argTypes: {
    open: true,
  },
  args: {
    open: true,
    onClose: action('onClose'),
  },
};
