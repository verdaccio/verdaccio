import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route as RouterRoute, Routes } from 'react-router';

import { SecurityRoutes } from '../../routes/SecurityRoutes';
import { Route } from '../../utils';

const meta: Meta = {
  title: 'Routes/SecurityRoutes',
  component: SecurityRoutes,
  parameters: {
    // layout: 'fullscreen',
    query: {
      // example of mocking ?greeting="Hello world!"
      greeting: 'Hello world!',
    },
    msw: {
      handlers: [
        http.post('https://my-registry.org/-/verdaccio/sec/login', async ({ request }) => {
          const body = (await request.json()) as {
            username: string;
            password: string;
          };

          if (body.username === 'fail') {
            return new HttpResponse('unauthorized', { status: 401 });
          }

          return HttpResponse.json({
            username: body.username,
            token: 'valid token',
          });
        }),
      ],
    },
  },
};

export default meta;
type Story = StoryObj;

export const WithMockedSearch = {
  render: () => {
    const urlParams = new URLSearchParams(document.location.search);
    const mockedParam = urlParams.get('greeting');
    return (
      <div>
        {'Mocked value:'}
        {mockedParam}
      </div>
    );
  },
};

/**
 * Router wrapper for rendering real routes inside Storybook
 */
const RouterWrapper = ({ initialEntries }: { initialEntries: string[] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <RouterRoute element={<SecurityRoutes />} path="/*" />
      </Routes>
    </MemoryRouter>
  );
};

export const Login: Story = {
  render: () => (
    <RouterWrapper
      initialEntries={[
        `${Route.LOGIN}?next=/-/v1/login_cli/965abc67-2441-456e-b889-f00254d41ea93&user=testuser`,
      ]}
    />
  ),
};

export const LoginFailure: Story = {
  name: 'Login (401 error)',
  render: () => <RouterWrapper initialEntries={[Route.LOGIN]} />,
};

export const Success: Story = {
  render: () => <RouterWrapper initialEntries={[Route.SUCCESS]} />,
};

export const AddUser: Story = {
  render: () => <RouterWrapper initialEntries={[Route.ADD_USER]} />,
};

export const ChangePassword: Story = {
  render: () => <RouterWrapper initialEntries={[Route.CHANGE_PASSWORD]} />,
};

export const NotFound: Story = {
  render: () => <RouterWrapper initialEntries={['/this-route-does-not-exist']} />,
};
