import React from 'react';

import { render, cleanup } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext, DetailContextProps } from '../../pages/Version';

import ActionBar from './ActionBar';

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

const ComponentToBeRendered: React.FC<{ contextValue: DetailContextProps }> = ({
  contextValue,
}) => (
  <DetailContext.Provider value={contextValue}>
    <ActionBar />
  </DetailContext.Provider>
);

describe('<ActionBar /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render the component in default state', () => {
    const { container } = render(<ComponentToBeRendered contextValue={detailContextValue} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('when there is no action bar data', () => {
    const packageMeta = {
      ...detailContextValue.packageMeta,
      latest: {
        ...detailContextValue.packageMeta.latest,
        homepage: undefined,
        bugs: undefined,
        dist: {
          ...detailContextValue.packageMeta.latest.dist,
          tarball: undefined,
        },
      },
    };

    const { container } = render(
      <ComponentToBeRendered contextValue={{ ...detailContextValue, packageMeta }} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('when there is a button to download a tarball', () => {
    const { getByTitle } = render(
      <ComponentToBeRendered contextValue={{ ...detailContextValue }} />
    );
    expect(getByTitle('Download tarball')).toBeTruthy();
  });

  test('when there is a button to open an issue', () => {
    const { getByTitle } = render(
      <ComponentToBeRendered contextValue={{ ...detailContextValue }} />
    );
    expect(getByTitle('Open an issue')).toBeTruthy();
  });
});
