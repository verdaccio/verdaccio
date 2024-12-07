import React from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { VersionProvider } from '../../providers';
import { store } from '../../store';
import { act, renderWithStore, screen, waitFor } from '../../test/test-react-testing-library';
import Sidebar from './Sidebar';

vi.mock('marked');
vi.mock('marked-highlight');

const ComponentSideBar: React.FC = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
    <VersionProvider>
      <Sidebar />
    </VersionProvider>
  </MemoryRouter>
);

const mockPkgName = vi.fn().mockReturnValue('jquery');

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useParams: () => ({
    package: mockPkgName(),
  }),
}));

describe('Sidebar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test('should render titles', async () => {
    act(() => {
      renderWithStore(<ComponentSideBar />, store);
    });
    await waitFor(() => expect(screen.getAllByText('jquery')).toHaveLength(2));

    expect(screen.getByText(`sidebar.detail.latest-version`, { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(/sidebar.detail.published .*years? ago/i, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(`sidebar.installation.title`, { exact: false })).toBeInTheDocument();
  });

  test('should render commonJS', async () => {
    act(() => {
      renderWithStore(<ComponentSideBar />, store);
    });
    // package name + keyword
    await waitFor(() => expect(screen.getAllByText('jquery')).toHaveLength(2));
    expect(screen.getByAltText('commonjs')).toBeInTheDocument();
  });

  test('should render typescript', async () => {
    mockPkgName.mockReturnValue('glob');
    act(() => {
      renderWithStore(<ComponentSideBar />, store);
    });
    // just package name
    await waitFor(() => expect(screen.getByText('glob')).toBeInTheDocument());
    expect(screen.getByAltText('typescript')).toBeInTheDocument();
  });

  test('should render es modules', async () => {
    mockPkgName.mockReturnValue('got');
    act(() => {
      renderWithStore(<ComponentSideBar />, store);
    });
    // package name + keyword
    await waitFor(() => expect(screen.getAllByText('got')).toHaveLength(2));
    expect(screen.getByAltText('es6 modules')).toBeInTheDocument();
  });
});
