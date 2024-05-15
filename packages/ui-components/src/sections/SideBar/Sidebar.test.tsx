import React from 'react';
import { MemoryRouter } from 'react-router';

import { VersionProvider } from '../../providers';
import { store } from '../../store';
import { renderWithStore, screen, waitFor } from '../../test/test-react-testing-library';
import Sidebar from './Sidebar';

jest.mock('marked');
jest.mock('marked-highlight');

const ComponentSideBar: React.FC = () => (
  <MemoryRouter>
    <VersionProvider>
      <Sidebar />
    </VersionProvider>
  </MemoryRouter>
);

const mockPkgName = jest.fn().mockReturnValue('jquery');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    package: mockPkgName(),
  }),
}));

describe('Sidebar', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render titles', async () => {
    mockPkgName.mockReturnValue('jquery');
    renderWithStore(<ComponentSideBar />, store);
    await waitFor(() => expect(screen.findAllByText('jquery')).toHaveLength(2));

    expect(screen.getByText(`sidebar.detail.latest-version`, { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(`sidebar.detail.published a year ago`, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(`sidebar.installation.title`, { exact: false })).toBeInTheDocument();
  });

  test('should render commonJS', async () => {
    mockPkgName.mockReturnValue('jquery');
    renderWithStore(<ComponentSideBar />, store);
    // package name + keyword
    await waitFor(() => expect(screen.getAllByText('jquery')).toHaveLength(2));
    expect(screen.getByAltText('commonjs')).toBeInTheDocument();
  });

  test('should render typescript', async () => {
    mockPkgName.mockReturnValue('glob');
    renderWithStore(<ComponentSideBar />, store);
    // just package name
    await waitFor(() => expect(screen.getAllByText('glob')).toHaveLength(1));
    expect(screen.getByAltText('typescript')).toBeInTheDocument();
  });

  test('should render es modules', async () => {
    mockPkgName.mockReturnValue('got');
    renderWithStore(<ComponentSideBar />, store);
    // package name + keyword
    await waitFor(() => expect(screen.getAllByText('got')).toHaveLength(2));
    expect(screen.getByAltText('es6 modules')).toBeInTheDocument();
  });
});
