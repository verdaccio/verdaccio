import React from 'react';
import { MemoryRouter } from 'react-router';

import { store } from '../';
import { act, renderWithStore, screen, waitFor } from '../test/test-react-testing-library';
import AppRoute from './AppRoute';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

function appTest(path: string) {
  renderWithStore(
    <MemoryRouter initialEntries={[path]}>
      <AppRoute />
    </MemoryRouter>,
    store
  );
}

// See jest/server-handlers.ts for test routes
describe('AppRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Front component for ROOT path', async () => {
    act(() => appTest('/'));
    await waitFor(() => expect(screen.getByTestId('loading')).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(5));
  });

  test('renders VersionPage component for PACKAGE path', async () => {
    act(() => appTest('/-/web/detail/jquery'));
    await waitFor(() => screen.getByTestId('readme-tab'));
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  test('renders VersionPage component for PACKAGE VERSION path', async () => {
    act(() => appTest('/-/web/detail/jquery/v/3.6.3'));
    await waitFor(() => screen.getByTestId('readme-tab'));
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  test('renders Forbidden component for not allowed PACKAGE', async () => {
    act(() => appTest('/-/web/detail/JSONstream'));
    await waitFor(() => screen.getByTestId('not-found-go-to-home-button'));
  });

  test('renders NotFound component for missing PACKAGE', async () => {
    act(() => appTest('/-/web/detail/kleur'));
    await waitFor(() => screen.getByTestId('not-found-go-to-home-button'));
  });

  test('renders NotFound component for non-existing PACKAGE VERSION', async () => {
    act(() => appTest('/-/web/detail/jquery/v/0.9.9'));
    await waitFor(() => screen.getByTestId('not-found-go-to-home-button'));
  });

  test('renders NotFound component for non-matching path', async () => {
    act(() => appTest('/oiccadrev'));
    await waitFor(() => screen.getByTestId('not-found-go-to-home-button'));
  });
});
