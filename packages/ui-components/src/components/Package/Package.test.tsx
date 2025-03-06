import React from 'react';
import { MemoryRouter } from 'react-router';

import { store } from '../../';
import { cleanupDownloadMocks, setupDownloadMocks } from '../../../vitest/vitestHelpers';
import {
  cleanup,
  fireEvent,
  renderWithStore,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import Package from './Package';

/**
 * Generates one month back date from current time
 * @return {object} date object
 */
const dateOneMonthAgo = (): Date => new Date(1544377770747);

const props = {
  name: 'verdaccio',
  version: '1.0.0',
  time: String(dateOneMonthAgo()),
  license: 'MIT',
  description: 'Private NPM repository',
  author: {
    name: 'Sam',
  },
  dist: {
    fileCount: 1,
    unpackedSize: 171,
    tarball: 'http://localhost:9000/verdaccio/-/verdaccio-1.0.0.tgz',
  },
  keywords: ['verdaccio-core'],
};

beforeAll(() => {
  setupDownloadMocks();
});

afterAll(() => {
  cleanupDownloadMocks();
});

describe('<Package /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load the component', () => {
    const wrapper = renderWithStore(
      <MemoryRouter>
        <Package
          author={props.author}
          description={props.description}
          dist={props.dist}
          keywords={props.keywords}
          license={props.license}
          name={props.name}
          time={props.time}
          version={props.version}
        />
      </MemoryRouter>,
      store
    );

    // FUTURE: improve this expectectations
    expect(wrapper.getByText('verdaccio')).toBeInTheDocument();
    expect(wrapper.getByText('Private NPM repository')).toBeInTheDocument();
    expect(wrapper.getByText('package.version')).toBeInTheDocument();
    expect(wrapper.getByText('MIT')).toBeInTheDocument();
  });

  // test if click on download button will trigger the download action
  test('should download the package', async () => {
    renderWithStore(
      <MemoryRouter>
        <Package
          author={props.author}
          description={props.description}
          dist={props.dist}
          keywords={props.keywords}
          license={props.license}
          name={props.name}
          time={props.time}
          version={props.version}
        />
      </MemoryRouter>,
      store
    );

    fireEvent.click(screen.getByTestId('download-tarball'));
    await waitFor(() => expect(store.getState().loading.models.download).toBe(true));
  });
});
