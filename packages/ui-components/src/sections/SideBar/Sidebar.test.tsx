import React from 'react';
import { vi } from 'vitest';

import { VersionProvider } from '../../providers';
import { act, renderWithRouteDetail, screen, waitFor } from '../../test/test-react-testing-library';
import Sidebar from './Sidebar';

vi.mock('marked');
vi.mock('marked-highlight');

const ComponentSideBar: React.FC = () => (
  <VersionProvider>
    <Sidebar />
  </VersionProvider>
);

describe('Sidebar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render titles', async () => {
    await act(async () => {
      renderWithRouteDetail(<ComponentSideBar />, 'jquery');
    });
    await waitFor(() => expect(screen.getAllByText('jquery')).toHaveLength(2));

    expect(screen.getByText(`sidebar.detail.latest-version`, { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(/sidebar.detail.published .*years? ago/i, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(`sidebar.installation.title`, { exact: false })).toBeInTheDocument();
  });

  test('should render commonJS', async () => {
    await act(async () => {
      renderWithRouteDetail(<ComponentSideBar />, 'jquery');
    });
    // package name + keyword
    await waitFor(() => expect(screen.getAllByText('jquery')).toHaveLength(2));
    expect(screen.getByAltText('commonjs')).toBeInTheDocument();
  });
});
