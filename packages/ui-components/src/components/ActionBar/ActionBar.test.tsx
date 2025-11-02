import React from 'react';

import { cleanupDownloadMocks, setupDownloadMocks } from '../../../vitest/vitestHelpers';
import {
  cleanup,
  fireEvent,
  renderWith,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
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

beforeAll(() => {
  setupDownloadMocks();
});

afterAll(() => {
  cleanupDownloadMocks();
});

describe('<ActionBar /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render the component in default state', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} />);
    await waitFor(() => {
      expect(screen.getByTestId('download-tarball-btn')).toBeInTheDocument();
      expect(screen.getByTestId('BugReportIcon')).toBeInTheDocument();
      expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
    });
  });

  test('should not render if data is missing', async () => {
    // @ts-ignore - testing with missing data
    renderWith(<ActionBar packageMeta={undefined} />);
    await waitFor(() => {
      expect(screen.queryByTestId('HomeIcon')).toBeNull();
    });
  });

  test('when there is no action bar data', async () => {
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

    renderWith(<ActionBar packageMeta={packageMeta} />);
    await waitFor(() => {
      expect(screen.queryByTestId('download-tarball-btn')).not.toBeInTheDocument();
      expect(screen.queryByTestId('BugReportIcon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('HomeIcon')).not.toBeInTheDocument();
    });
  });

  test('when there is a button to download a tarball', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} />);
    await waitFor(() => {
      expect(screen.getByLabelText('action-bar-action.download-tarball')).toBeTruthy();
    });
  });

  test('when button to download is disabled', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} showDownloadTarball={false} />);
    await waitFor(() => {
      expect(screen.queryByTestId('download-tarball-btn')).not.toBeInTheDocument();
    });
  });

  test('when there is a button to raw manifest', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />);
    await waitFor(() => {
      expect(screen.getByLabelText('action-bar-action.raw')).toBeTruthy();
    });
  });

  test('when click button to raw manifest open a dialog with viewer', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />);
    await waitFor(() => {
      expect(screen.queryByTestId('rawViewer--dialog')).toBeFalsy();
    });

    fireEvent.click(screen.getByLabelText('action-bar-action.raw'));
    await waitFor(() => {
      expect(screen.getByTestId('rawViewer--dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('close-raw-viewer'));
    await waitFor(() => {
      expect(screen.queryByTestId('rawViewer--dialog')).toBeFalsy();
    });
  });

  test('should not display download tarball button', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />);
    await waitFor(() => {
      expect(screen.queryByLabelText('Download tarball')).toBeFalsy();
    });
  });

  test('when click button to download', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />);
    fireEvent.click(screen.getByTestId('download-tarball-btn'));
    await waitFor(() => {
      expect(store.getState().loading.models.download).toBe(true);
    });
  });

  test('should not display show raw button', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />);
    await waitFor(() => {
      expect(screen.queryByLabelText('action-bar-action.raw')).toBeFalsy();
    });
  });

  test('when there is a button to open an issue', async () => {
    renderWith(<ActionBar packageMeta={defaultPackageMeta} />);
    await waitFor(() => {
      expect(screen.getByTestId('BugReportIcon')).toBeInTheDocument();
    });
  });
});
