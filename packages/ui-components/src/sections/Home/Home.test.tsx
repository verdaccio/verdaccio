/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { ManifestsProvider } from '../../providers';
import {
  RouterPath,
  act,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import Home from './Home';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

const ComponentHome: React.FC = () => (
  <ManifestsProvider>
    <Home />
  </ManifestsProvider>
);

describe('Home', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render titles', async () => {
    await act(async () => {
      renderWithRouter(<ComponentHome />, RouterPath.ROOT, ['/']);
    });
    await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(5));
  });

  test('should render loading', async () => {
    await act(async () => {
      renderWithRouter(<ComponentHome />, RouterPath.ROOT, ['/']);
    });
    await waitFor(() => expect(screen.getByTestId('loading')).toBeInTheDocument());
  });

  test('should render an error state when the packages endpoint is unreachable', async () => {
    // a network failure rejects without an HTTP code; the home page used to
    // render the empty-registry onboarding panel in that case
    const { server } = await import('../../../vitest/server');
    const { http, HttpResponse } = await import('msw');
    server.use(
      http.get('http://localhost:9000/-/verdaccio/data/packages', () => HttpResponse.error())
    );

    await act(async () => {
      renderWithRouter(<ComponentHome />, RouterPath.ROOT, ['/']);
    });
    await waitFor(() => expect(screen.getByTestId('generic-error')).toBeInTheDocument());
    expect(screen.queryByTestId('home-page-container')).not.toBeInTheDocument();
  });
});
