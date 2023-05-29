/* eslint-disable verdaccio/jsx-spread */
import { action } from '@storybook/addon-actions';
import React from 'react';

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
