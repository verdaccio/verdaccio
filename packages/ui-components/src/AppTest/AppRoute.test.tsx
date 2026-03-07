import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { MemoryRouter, renderWith } from '../test/test-react-testing-library';
import { Route } from '../utils';
// Import AppRoute after mocks
import AppRoute from './AppRoute';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

// Mock page components to avoid React.lazy/Suspense resolution issues in tests
vi.mock('../pages/Front', () => ({ default: () => <div data-testid="front-page" /> }));
vi.mock('../pages/Version', () => ({ default: () => <div data-testid="version-page" /> }));
vi.mock('../pages/Security/Login', () => ({
  default: () => <div data-testid="login-page">login-page</div>,
}));
vi.mock('../pages/Security/Success', () => ({
  default: () => <div data-testid="success-page">success-page</div>,
}));
vi.mock('../pages/Security/AddUser', () => ({
  default: () => <div data-testid="add-user-page">add-user-page</div>,
}));
vi.mock('../pages/Security/ChangePassword', () => ({
  default: () => <div data-testid="change-password-page">change-password-page</div>,
}));

// Make loadable resolve synchronously
vi.mock('../utils/loadable', () => ({
  default: (importFn: any) => {
    let Comp: any = null;
    const promise = importFn();
    promise.then((mod: any) => {
      Comp = mod.default;
    });
    // In vitest, vi.mock'd imports resolve synchronously
    return (props: any) => (Comp ? <Comp {...props} /> : null);
  },
}));

function setGlobalFlags(flags: Record<string, boolean>) {
  // @ts-ignore
  const opts = global.__VERDACCIO_BASENAME_UI_OPTIONS;
  // @ts-ignore
  global.__VERDACCIO_BASENAME_UI_OPTIONS = { ...opts, flags };
}

function clearGlobalFlags() {
  // @ts-ignore
  const opts = global.__VERDACCIO_BASENAME_UI_OPTIONS;
  // @ts-ignore
  global.__VERDACCIO_BASENAME_UI_OPTIONS = { ...opts, flags: undefined };
}

function appTest(path: string, overrideConfig = {}) {
  return renderWith(
    <MemoryRouter initialEntries={[path]}>
      <AppRoute />
    </MemoryRouter>,
    overrideConfig
  );
}

describe('AppRoute', () => {
  afterEach(() => {
    clearGlobalFlags();
  });

  test('renders Front component for ROOT path', () => {
    appTest(Route.ROOT);
    expect(screen.getByTestId('front-page')).toBeInTheDocument();
  });

  // TODO: these tests need MSW/rendering fixes for VersionPage
  test.todo('renders VersionPage component for PACKAGE path');
  test.todo('renders VersionPage component for PACKAGE VERSION path');
  test.todo('renders Forbidden component for not allowed PACKAGE');
  test.todo('renders NotFound component for missing PACKAGE');
  test.todo('renders NotFound component for non-existing PACKAGE VERSION');

  test('renders NotFound component for non-matching path', () => {
    appTest('/oiccadrev');
    expect(screen.getByTestId('not-found-go-to-home-button')).toBeInTheDocument();
  });

  test('renders Login page for LOGIN path', () => {
    appTest(Route.LOGIN);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders Success page for SUCCESS path', () => {
    appTest(Route.SUCCESS);
    expect(screen.getByTestId('success-page')).toBeInTheDocument();
  });

  test('renders AddUser page when createUser flag is enabled', () => {
    appTest(Route.ADD_USER, { flags: { createUser: true } });
    expect(screen.getByTestId('add-user-page')).toBeInTheDocument();
  });

  test('renders NotFound when navigating to AddUser without createUser flag', () => {
    appTest(Route.ADD_USER);
    expect(screen.getByTestId('not-found-go-to-home-button')).toBeInTheDocument();
  });

  test('renders ChangePassword page when changePassword flag is enabled', () => {
    const flags = { changePassword: true };
    setGlobalFlags(flags);
    appTest(Route.CHANGE_PASSWORD, { flags });
    expect(screen.getByTestId('change-password-page')).toBeInTheDocument();
  });

  test('renders NotFound when navigating to ChangePassword without flag', () => {
    appTest(Route.CHANGE_PASSWORD);
    expect(screen.getByTestId('not-found-go-to-home-button')).toBeInTheDocument();
  });
});
