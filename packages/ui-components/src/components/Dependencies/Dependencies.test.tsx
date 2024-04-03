import React from 'react';
import { HashRouter } from 'react-router-dom';

import { render, screen } from '../../test/test-react-testing-library';
import Dependencies from './Dependencies';

describe('<Dependencies /> component', () => {
  test('Renders a message when there are no dependencies', () => {
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
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      },
      _uplinks: {},
    };

    const { getByText } = render(<Dependencies packageMeta={packageMeta} />);

    expect(getByText('dependencies.has-no-dependencies')).toBeDefined();
  });

  test('renders a link to each dependency', () => {
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
        dependencies: {
          react: '16.9.0',
          'react-dom': '16.9.0',
        },
        devDependencies: {
          'babel-core': '7.0.0-beta6',
        },
        peerDependencies: {
          'styled-components': '5.0.0',
        },
      },
      _uplinks: {},
    };

    const { getByText } = render(
      <HashRouter>
        <Dependencies packageMeta={packageMeta} />
      </HashRouter>
    );

    expect(getByText('dependencies (2)')).toBeDefined();
    expect(getByText('devDependencies (1)')).toBeDefined();
    expect(getByText('peerDependencies (1)')).toBeDefined();
    expect(screen.queryAllByText('dependencies.dependency-block')).toHaveLength(4);
  });
});
