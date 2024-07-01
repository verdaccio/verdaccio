import React from 'react';

import { store } from '../../store/store';
import { cleanup, fireEvent, renderWithStore, screen } from '../../test/test-react-testing-library';
import ActionBar from './ActionBar';

const defaultPackageMeta = {
  _uplinks: {},
  latest: {
    name: 'verdaccio',
    version: '1.0.0',
    dist: {
      fileCount: 1,
      unpackedSize: 171,
      tarball: 'http://localhost:9000/verdaccio/-/verdaccio-1.0.0.tgz',
    },
    homepage: 'https://verdaccio.org',
    bugs: {
      url: 'https://github.com/verdaccio/verdaccio/issues',
    },
  },
};

describe('<ActionBar /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render the component in default state', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} />, store);
    expect(screen.getByTestId('download-tarball-btn')).toBeInTheDocument();
    expect(screen.getByTestId('BugReportIcon')).toBeInTheDocument();
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
  });

  test('should not render if data is missing', () => {
    // @ts-ignore - testing with missing data
    renderWithStore(<ActionBar packageMeta={undefined} />, store);
    expect(screen.queryByTestId('HomeIcon')).toBeNull();
  });

  test('when there is no action bar data', () => {
    const packageMeta = {
      ...defaultPackageMeta,
      latest: {
        ...defaultPackageMeta.latest,
        homepage: undefined,
        bugs: undefined,
        dist: {
          ...defaultPackageMeta.latest.dist,
          tarball: undefined,
        },
      },
    };

    renderWithStore(<ActionBar packageMeta={packageMeta} />, store);
    expect(screen.queryByTestId('download-tarball-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('BugReportIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('HomeIcon')).not.toBeInTheDocument();
  });

  test('when there is a button to download a tarball', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} />, store);
    expect(screen.getByLabelText('action-bar-action.download-tarball')).toBeTruthy();
  });

  test('when button to download is disabled', () => {
    renderWithStore(
      <ActionBar packageMeta={defaultPackageMeta} showDownloadTarball={false} />,
      store
    );
    expect(screen.queryByTestId('download-tarball-btn')).not.toBeInTheDocument();
  });

  test('when there is a button to raw manifest', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />, store);
    expect(screen.getByLabelText('action-bar-action.raw')).toBeTruthy();
  });

  test('when click button to raw manifest open a dialog with viewer', async () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />, store);
    expect(screen.queryByTestId('rawViewer--dialog')).toBeFalsy();

    fireEvent.click(screen.getByLabelText('action-bar-action.raw'));
    await screen.findByTestId('rawViewer--dialog');

    fireEvent.click(screen.getByTestId('close-raw-viewer'));
    await screen.getByLabelText('action-bar-action.raw');

    expect(screen.queryByTestId('rawViewer--dialog')).toBeFalsy();
  });

  test('should not display download tarball button', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />, store);
    expect(screen.queryByLabelText('Download tarball')).toBeFalsy();
  });

  test('when click button to download ', async () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />, store);
    fireEvent.click(screen.getByTestId('download-tarball-btn'));
    await store.getState().loading.models.download;
  });

  test('should not display show raw button', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />, store);
    expect(screen.queryByLabelText('action-bar-action.raw')).toBeFalsy();
  });

  test('when there is a button to open an issue', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} />, store);
    expect(screen.getByTestId('BugReportIcon')).toBeInTheDocument();
  });
});
