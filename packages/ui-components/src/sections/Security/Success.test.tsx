import React from 'react';
import { Route as RouterRoute, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import {
  act,
  cleanup,
  fireEvent,
  renderWithRouter,
  screen,
} from '../../test/test-react-testing-library';
import { Route } from '../../utils';
import Success, { MessageType } from './Success';

describe('<Success /> component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    cleanup();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  test('should render success title', async () => {
    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [Route.SUCCESS]);
    });

    expect(screen.getByText('security.success.title')).toBeInTheDocument();
  });

  test('should render default message when no messageType is provided', async () => {
    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [Route.SUCCESS]);
    });

    expect(screen.getByText('security.success.messageSuccess')).toBeInTheDocument();
  });

  test('should render Login message when messageType is Login', async () => {
    const url = `${Route.SUCCESS}?messageType=${MessageType.Login}`;

    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [url]);
    });

    expect(screen.getByText('security.success.messageLogin')).toBeInTheDocument();
  });

  test('should render AddUser message when messageType is AddUser', async () => {
    const url = `${Route.SUCCESS}?messageType=${MessageType.AddUser}`;

    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [url]);
    });

    expect(screen.getByText('security.success.messageAddUser')).toBeInTheDocument();
  });

  test('should render ChangePassword message when messageType is ChangePassword', async () => {
    const url = `${Route.SUCCESS}?messageType=${MessageType.ChangePassword}`;

    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [url]);
    });

    expect(screen.getByText('security.success.messageChangePassword')).toBeInTheDocument();
  });

  test('should render submit button', async () => {
    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [Route.SUCCESS]);
    });

    expect(screen.getByText('security.success.submit')).toBeInTheDocument();
  });

  test('should redirect to home when submit button is clicked', async () => {
    // navigation goes through the router (keeping the basename) instead of
    // window.location, so assert on the rendered route
    await act(async () => {
      renderWithRouter(
        <Routes>
          <RouterRoute element={<Success />} path={Route.SUCCESS} />
          <RouterRoute element={<div data-testid="home" />} path={Route.ROOT} />
        </Routes>,
        '*',
        [Route.SUCCESS]
      );
    });

    const button = screen.getByText('security.success.submit');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});
