import _ from 'lodash';
import React from 'react';
import { renderWithStore, screen, waitFor } from 'verdaccio-ui/utils/test-react-testing-library';

import { store } from '../../../store';
import { DetailContext } from '../context';
import { DetailContextProps } from '../version-config';
import DetailSidebar from './DetailSidebar';

const ComponentToBeRendered: React.FC<{ contextValue: DetailContextProps }> = ({
  contextValue,
}) => (
  <DetailContext.Provider value={contextValue}>
    <DetailSidebar />
  </DetailContext.Provider>
);

// https://stackoverflow.com/a/54010619/308341
jest.mock('react', () => {
  const React = jest.requireActual('react');
  React.Suspense = ({ children }) => children;
  return React;
});

const detailContextValue: DetailContextProps = {
  packageName: 'foo',
  readMe: 'test',
  enableLoading: () => {},
  isLoading: false,
  hasNotBeenFound: false,
  packageMeta: {
    _uplinks: {},
    latest: {
      name: 'verdaccio-ui/local-storage',
      version: '8.0.1-next.1',
      dist: {
        fileCount: 0,
        unpackedSize: 0,
        tarball: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
      },
      homepage: 'https://verdaccio.org',
      bugs: {
        url: 'https://github.com/verdaccio/monorepo/issues',
      },
    },
  },
};

describe('DetailSidebar', () => {
  test('should render commonjs module icon', async () => {
    const { getByAltText } = renderWithStore(
      <ComponentToBeRendered
        contextValue={_.merge(detailContextValue, {
          packageMeta: {
            latest: {
              type: 'commonjs',
            },
          },
        })}
      />,
      store
    );

    await waitFor(() => expect(getByAltText('commonjs')).toBeInTheDocument());
  });

  test('should render ts module icon', () => {
    renderWithStore(
      <ComponentToBeRendered
        contextValue={_.merge(detailContextValue, {
          packageMeta: {
            latest: {
              types: './src/index.d.ts',
            },
          },
        })}
      />,
      store
    );
    expect(screen.getByAltText('typescript')).toBeInTheDocument();
  });

  test('should render es6 module icon', () => {
    renderWithStore(
      <ComponentToBeRendered
        contextValue={_.merge(detailContextValue, {
          packageMeta: {
            latest: {
              type: 'module',
            },
          },
        })}
      />,
      store
    );
    expect(screen.getByAltText('es6 modules')).toBeInTheDocument();
  });
});
