/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { useLocation } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { ManifestsProvider } from '../../providers';
import { mockHomePackages } from '../../../vitest/msw-utils';
import { server } from '../../../vitest/server';
import {
  RouterPath,
  act,
  fireEvent,
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
    await waitFor(() => expect(screen.getByTestId('package-list-skeleton')).toBeInTheDocument());
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

  describe('filter toolbar', () => {
    const fixture = ['@verdaccio/ui-components', '@verdaccio/core', 'jquery'].map((name) => ({
      name,
      version: '1.0.0',
      description: `${name} description`,
      author: { name: 'Sam' },
    }));

    const LocationSearch: React.FC = () => {
      const { search } = useLocation();
      return <span data-testid="location-search">{search}</span>;
    };

    const renderHome = async (entry = '/') => {
      server.use(mockHomePackages(fixture));
      await act(async () => {
        renderWithRouter(
          <>
            <ComponentHome />
            <LocationSearch />
          </>,
          RouterPath.ROOT,
          [entry]
        );
      });
      await waitFor(() => expect(screen.getByTestId('package-list-toolbar')).toBeInTheDocument());
    };

    test('narrows the list and keeps the filter in the url', async () => {
      await renderHome();
      fireEvent.change(screen.getByTestId('package-list-filter'), {
        target: { value: 'verdaccio' },
      });
      await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(2));
      expect(screen.getByTestId('location-search').textContent).toBe('?q=verdaccio');
      expect(screen.getByTestId('package-list-count').textContent).toBe('packageList.count');
    });

    test('restores the filter from the url', async () => {
      await renderHome('/?q=jquery');
      await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(1));
      expect(screen.getByTestId('package-list-filter')).toHaveValue('jquery');
    });

    test('hides the toolbar while the registry holds a single package', async () => {
      server.use(mockHomePackages(fixture.slice(0, 1)));
      await act(async () => {
        renderWithRouter(<ComponentHome />, RouterPath.ROOT, ['/']);
      });
      await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(1));
      expect(screen.queryByTestId('package-list-toolbar')).not.toBeInTheDocument();
    });

    test('hides the toolbar and ignores ?q= when showPackageListToolbar is false', async () => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS = { showPackageListToolbar: false };
      server.use(mockHomePackages(fixture));
      await act(async () => {
        renderWithRouter(<ComponentHome />, RouterPath.ROOT, ['/?q=jquery']);
      });
      await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(3));
      expect(screen.queryByTestId('package-list-toolbar')).not.toBeInTheDocument();
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {};
    });

    test('shows a no-match message instead of the onboarding help', async () => {
      await renderHome('/?q=nothing-matches');
      expect(screen.getByTestId('package-list-no-match')).toBeInTheDocument();
      expect(screen.queryByTestId('help-card')).not.toBeInTheDocument();
    });
  });
});
