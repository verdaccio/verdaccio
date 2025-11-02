import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ManifestsProvider } from '../../providers';
import { AddUser, ChangePassword, Login, Success } from './index';

/**
 * Meta
 * We can safely pick one component for typing;
 * the others will still work as separate stories.
 */
const meta: Meta<typeof AddUser> = {
  title: 'Sections/Security',
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ManifestsProvider>
          <Story />
        </ManifestsProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

/* ----------------------------------------
 * AddUser
 * ------------------------------------- */

export const AddUserDefault: StoryObj<typeof AddUser> = {
  render: () => <AddUser />,
  parameters: {
    // msw: {
    //   handlers: [
    //     http.get('https://my-registry.org/-/verdaccio/data/packages', () =>
    //       HttpResponse.json(require('../../../vitest/api/home.json'))
    //     ),
    //   ],
    // },
  },
};

/* ----------------------------------------
 * ChangePassword
 * ------------------------------------- */

export const ChangePasswordDefault: StoryObj<typeof ChangePassword> = {
  render: () => <ChangePassword />,
};

/* ----------------------------------------
 * Login
 * ------------------------------------- */

export const LoginDefault: StoryObj<typeof Login> = {
  render: () => <Login />,
};

/* ----------------------------------------
 * Success
 * ------------------------------------- */

export const SuccessDefault: StoryObj<typeof Success> = {
  render: () => <Success />,
};
