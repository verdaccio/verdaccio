import React from 'react';
import { vi } from 'vitest';

import { cleanup, render, screen } from '../../test/test-react-testing-library';
import { PackageMetaInterface } from '../../types/packageMeta';
import Authors from './Author';

const withAuthorComponent = (packageMeta: PackageMetaInterface): JSX.Element => (
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

    const wrapper = render(withAuthorComponent(packageMeta));
    expect(wrapper).toMatchSnapshot();
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

    const wrapper = render(withAuthorComponent(packageMeta));
    expect(wrapper.queryAllByText('verdaccio')).toHaveLength(0);
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

    const wrapper = render(withAuthorComponent(packageMeta));
    expect(wrapper).toMatchSnapshot();
  });

  test('should not render if data is missing', () => {
    // @ts-ignore - testing with missing data
    render(withAuthorComponent(undefined));
    expect(screen.queryByText('sidebar.author.title')).toBeNull();
  });
});
