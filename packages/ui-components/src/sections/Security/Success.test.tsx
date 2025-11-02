import React from 'react';

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
    await act(async () => {
      renderWithRouter(<Success />, Route.SUCCESS, [Route.SUCCESS]);
    });

    const button = screen.getByText('security.success.submit');
    fireEvent.click(button);

    expect(window.location.href).toBe('/');
  });
});
