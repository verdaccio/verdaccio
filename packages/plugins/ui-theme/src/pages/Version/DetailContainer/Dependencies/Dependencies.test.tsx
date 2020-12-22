import React from 'react';
import { HashRouter } from 'react-router-dom';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContextProvider } from '../../context';

import Dependencies from './Dependencies';

describe('<Dependencies /> component', () => {
  test('Renders a message when there are no dependencies', () => {
    // Given
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

    // When
    const { getByText } = render(
      <DetailContextProvider value={{ packageMeta }}>
        <Dependencies />
      </DetailContextProvider>
    );

    // Then
    expect(getByText('verdaccio has no dependencies.')).toBeDefined();
  });

  test('Renders a link to each dependency', () => {
    // Given
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

    // When
    const { getByText } = render(
      <HashRouter>
        <DetailContextProvider value={{ packageMeta }}>
          <Dependencies />
        </DetailContextProvider>
      </HashRouter>
    );

    // Then
    // FIXME: currently MaterialUI chips do not support the children
    // prop, therefore it is impossible to use proper links for
    // dependencies. Those are for now clickable spans

    expect(getByText('dependencies (2)')).toBeDefined();
    expect(getByText('react@16.9.0').tagName).toBe('SPAN');
    expect(getByText('react-dom@16.9.0').tagName).toBe('SPAN');

    expect(getByText('devDependencies (1)')).toBeDefined();
    expect(getByText('babel-core@7.0.0-beta6').tagName).toBe('SPAN');

    expect(getByText('peerDependencies (1)')).toBeDefined();
    expect(getByText('styled-components@5.0.0').tagName).toBe('SPAN');
  });
});
