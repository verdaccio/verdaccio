import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { action } from 'storybook/actions';

import LoginDialog from './LoginDialog';

type Story = StoryObj<typeof LoginDialog>;

const meta: Meta<typeof LoginDialog> = {
  title: 'Components/LoginDialog',
  component: LoginDialog,
};

export default meta;

export const OpenLoginDialog: Story = {
  render: (args) => <LoginDialog {...args} />,
  args: {
    open: true,
    onClose: action('onClose'),
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://my-registry.org/-/verdaccio/sec/login', async ({ request }) => {
          const body = (await request.json()) as { username: string; password: string };
          console.log('boddy--->', body);

          if (body.username === 'fail') {
            return new HttpResponse('unauthorized', { status: 401 });
          }

          return HttpResponse.json({ username: body.username, token: 'valid token' });
        }),
      ],
    },
  },
};
