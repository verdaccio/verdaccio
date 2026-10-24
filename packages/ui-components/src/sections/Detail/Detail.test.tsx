import React from 'react';
import { useLocation } from 'react-router';
import { afterEach, describe, expect, test } from 'vitest';

import { VersionProvider } from '../../providers';
import {
  MemoryRouter,
  RouterPath,
  RouterRoute,
  Routes,
  cleanup,
  fireEvent,
  renderWith,
  renderWithRouteDetail,
  screen,
} from '../../test/test-react-testing-library';
import DetailContainer from './Detail';

const LocationSearch: React.FC = () => (
  <span data-testid="location-search">{useLocation().search}</span>
);

const renderDetailAt = (entry: string) =>
  renderWith(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <RouterRoute
          element={
            <VersionProvider>
              <DetailContainer />
              <LocationSearch />
            </VersionProvider>
          }
          path={RouterPath.PACKAGE}
        />
      </Routes>
    </MemoryRouter>
  );

describe('DetailContainer', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders correctly', () => {
    renderWithRouteDetail(<DetailContainer />);
    expect(screen.getByTestId('readme-tab')).toBeInTheDocument();
    expect(screen.getByTestId('dependencies-tab')).toBeInTheDocument();
    expect(screen.getByTestId('versions-tab')).toBeInTheDocument();
  });

  test('renders without uplinks', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = false;
    renderWithRouteDetail(<DetailContainer />);
    expect(screen.queryByTestId('uplinks-tab')).toBeFalsy();
  });

  test('selects the tab named in the url', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = false;
    renderDetailAt('/-/web/detail/jquery?tab=versions');
    expect(screen.getByTestId('versions-tab')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('readme-tab')).toHaveAttribute('aria-selected', 'false');
  });

  test('falls back to the readme for an unknown or hidden tab', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = false;
    renderDetailAt('/-/web/detail/jquery?tab=uplinks');
    expect(screen.getByTestId('readme-tab')).toHaveAttribute('aria-selected', 'true');
  });

  test('writes the selected tab to the url and drops it for the readme', () => {
    renderDetailAt('/-/web/detail/jquery');
    fireEvent.click(screen.getByTestId('dependencies-tab'));
    expect(screen.getByTestId('location-search').textContent).toBe('?tab=dependencies');
    expect(screen.getByTestId('dependencies-tab')).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByTestId('readme-tab'));
    expect(screen.getByTestId('location-search').textContent).toBe('');
  });
});
