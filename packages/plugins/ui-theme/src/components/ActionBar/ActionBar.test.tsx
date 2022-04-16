import React from 'react';
import {
  cleanup,
  fireEvent,
  renderWithStore,
  screen,
} from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext, DetailContextProps } from '../../pages/Version';
import { store } from '../../store/store';
import ActionBar, { Props } from './ActionBar';

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

const ComponentToBeRendered: React.FC<{ contextValue: DetailContextProps; props?: Props }> = ({
  contextValue,
  props,
}) => (
  <DetailContext.Provider value={contextValue}>
    <ActionBar {...props} />
  </DetailContext.Provider>
);

describe('<ActionBar /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render the component in default state', () => {
    const { container } = renderWithStore(
      <ComponentToBeRendered contextValue={detailContextValue} />,
      store
    );
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

    const { container } = renderWithStore(
      <ComponentToBeRendered contextValue={{ ...detailContextValue, packageMeta }} />,
      store
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('when there is a button to download a tarball', () => {
    renderWithStore(<ComponentToBeRendered contextValue={{ ...detailContextValue }} />, store);
    expect(screen.getByLabelText('Download tarball')).toBeTruthy();
  });

  test('when there is a button to raw manifest', () => {
    renderWithStore(
      <ComponentToBeRendered contextValue={{ ...detailContextValue }} props={{ showRaw: true }} />,
      store
    );
    expect(screen.getByLabelText('Raw Manifest')).toBeTruthy();
  });

  test('when click button to raw manifest open a dialog with viewver', () => {
    renderWithStore(
      <ComponentToBeRendered contextValue={{ ...detailContextValue }} props={{ showRaw: true }} />,
      store
    );
    fireEvent.click(screen.getByLabelText('Raw Manifest'));
    expect(screen.getByTestId('raw-viewver-dialog')).toBeInTheDocument();
  });

  test('should not display download tarball button', () => {
    renderWithStore(
      <ComponentToBeRendered
        contextValue={{ ...detailContextValue }}
        props={{ showDownloadTarball: false }}
      />,
      store
    );
    expect(screen.queryByLabelText('Download tarball')).toBeFalsy();
  });

  test('should not display show raw button', () => {
    renderWithStore(
      <ComponentToBeRendered contextValue={{ ...detailContextValue }} props={{ showRaw: false }} />,
      store
    );
    expect(screen.queryByLabelText('Raw Manifest')).toBeFalsy();
  });

  test('when there is a button to open an issue', () => {
    renderWithStore(<ComponentToBeRendered contextValue={{ ...detailContextValue }} />, store);
    expect(screen.getByLabelText('Open an issue')).toBeTruthy();
  });
});
