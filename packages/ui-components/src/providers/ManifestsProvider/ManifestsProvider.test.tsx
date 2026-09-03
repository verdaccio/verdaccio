import { HttpResponse, http } from 'msw';
import React from 'react';
import { useSWRConfig } from 'swr';

import { server } from '../../../vitest/server';
import {
  RouterPath,
  act,
  cleanup,
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import ManifestsProvider, { useManifests } from './ManifestsProvider';

const PACKAGES_URL = 'http://localhost:9000/-/verdaccio/data/packages';

function CustomComponent() {
  const { isError, isLoading, manifests } = useManifests();
  const { mutate } = useSWRConfig();

  return isLoading ? (
    <div>{'loading ...'}</div>
  ) : (
    <div>
      <button onClick={() => mutate(() => true)} type="button">
        {'revalidate'}
      </button>
      <div>{isError ? 'has-error' : 'no-error'}</div>
      {'packages:'}
      {manifests?.length}
    </div>
  );
}

describe('<ManifestsProvider />', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load data from the provider', async () => {
    await act(async () =>
      renderWithRouter(
        <ManifestsProvider>
          <CustomComponent />
        </ManifestsProvider>,
        RouterPath.ROOT,
        [RouterPath.ROOT]
      )
    );

    await waitFor(() => screen.getByText(400, { exact: false }));
  });

  test('should flag an error when the backend fails with nothing cached', async () => {
    server.use(http.get(PACKAGES_URL, () => HttpResponse.error()));

    await act(async () =>
      renderWithRouter(
        <ManifestsProvider>
          <CustomComponent />
        </ManifestsProvider>,
        RouterPath.ROOT,
        [RouterPath.ROOT]
      )
    );

    await waitFor(() => screen.getByText('has-error'));
  });

  test('should keep the cached list when a revalidation fails', async () => {
    await act(async () =>
      renderWithRouter(
        <ManifestsProvider>
          <CustomComponent />
        </ManifestsProvider>,
        RouterPath.ROOT,
        [RouterPath.ROOT]
      )
    );
    await waitFor(() => screen.getByText(400, { exact: false }));

    server.use(http.get(PACKAGES_URL, () => HttpResponse.error()));
    fireEvent.click(screen.getByText('revalidate'));
    // let the failed refetch settle
    await act(async () => new Promise((resolve) => setTimeout(resolve, 300)));

    expect(screen.getByText('no-error')).toBeInTheDocument();
    expect(screen.getByText(400, { exact: false })).toBeInTheDocument();
  });
});
