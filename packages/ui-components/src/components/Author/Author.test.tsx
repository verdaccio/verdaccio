import React from 'react';
import { vi } from 'vitest';

import { cleanup, renderWith, screen } from '../../test/test-react-testing-library';
import type { PackageMetaInterface } from '../../types/packageMeta';
import Authors from './Author';

const withAuthorComponent = (packageMeta: PackageMetaInterface): React.JSX.Element => (
  <Authors packageMeta={packageMeta} />
);

describe('<Author /> component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  test('should render the component in default state', () => {
    const packageMeta = {
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        author: {
          name: 'verdaccio user',
          email: 'verdaccio.user@verdaccio.org',
          url: '',
          avatar: 'https://www.gravatar.com/avatar/000000',
        },
        dist: { fileCount: 0, unpackedSize: 0 },
      },
      _uplinks: {},
    };

    renderWith(withAuthorComponent(packageMeta));
    expect(screen.getByText('sidebar.author.title')).toBeInTheDocument();
    expect(screen.getByAltText('verdaccio user')).toBeInTheDocument();
    expect(screen.getByText('verdaccio user')).toBeInTheDocument();
    const emailElement = screen.getByTestId('verdaccio user');
    expect(emailElement).toBeInTheDocument();
    expect(emailElement).toHaveAttribute(
      'href',
      'mailto:verdaccio.user@verdaccio.org?subject=verdaccio v4.0.0'
    );
    expect(emailElement).toHaveAttribute('target', '_blank');
    expect(emailElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should render the component when there is no author information available', () => {
    const packageMeta = {
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        dist: { fileCount: 0, unpackedSize: 0 },
      },
      _uplinks: {},
    };

    renderWith(withAuthorComponent(packageMeta));
    expect(screen.queryAllByText('verdaccio')).toHaveLength(0);
  });

  test('should render the component when there is no author email', () => {
    const packageMeta = {
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        author: {
          name: 'verdaccio user',
          url: '',
          avatar: 'https://www.gravatar.com/avatar/000000',
        },
        dist: { fileCount: 0, unpackedSize: 0 },
      },
      _uplinks: {},
    };

    renderWith(withAuthorComponent(packageMeta));
    const emailElement = screen.queryByTestId('verdaccio user');
    expect(emailElement).not.toHaveAttribute('href');
    expect(emailElement).not.toHaveAttribute('target');
    expect(emailElement).not.toHaveAttribute('rel');
    expect(screen.getByText('verdaccio user')).toBeInTheDocument();
  });

  test('should not render if data is missing', () => {
    // @ts-ignore - testing with missing data
    renderWith(withAuthorComponent(undefined));
    expect(screen.queryByText('sidebar.author.title')).toBeNull();
  });
});
