import React from 'react';

import { render, cleanup } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext } from '../../pages/Version';

import Authors from './Author';

const withAuthorComponent = (
  packageMeta: React.ContextType<typeof DetailContext>['packageMeta']
): JSX.Element => (
  <DetailContext.Provider value={{ packageMeta }}>
    <Authors />
  </DetailContext.Provider>
);

describe('<Author /> component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
    wrapper.debug();
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
});
