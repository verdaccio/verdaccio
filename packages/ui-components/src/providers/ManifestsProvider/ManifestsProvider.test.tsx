import { HttpResponse, http } from 'msw';
import React from 'react';
import { useSWRConfig } from 'swr';
import { afterEach, describe, expect, test } from 'vitest';

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
import ManifestsProvider, { CACHED_PAGE_SIZE, useManifests } from './ManifestsProvider';

const PACKAGES_URL = 'http://localhost:9000/-/verdaccio/data/packages';
const CACHED_URL = 'http://localhost:9000/-/verdaccio/data/packages/cached';

const pkg = (name: string, origin: 'private' | 'cached') => ({ name, version: '1.0.0', origin });

function PagedComponent() {
  const { isLoading, loadMore, manifests } = useManifests();
  return isLoading ? (
    <div>{'loading ...'}</div>
  ) : (
    <div>
      <button onClick={() => loadMore?.()} type="button">
        {'more'}
      </button>
      <div>{`total:${manifests?.length}`}</div>
      <div>{`cached:${manifests?.filter((m) => m.origin === 'cached').length}`}</div>
    </div>
  );
}

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

  describe('with flags.cachedPackages', () => {
    const options = window.__VERDACCIO_BASENAME_UI_OPTIONS;

    afterEach(() => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS = options;
    });

    test('should append cached packages page by page after the private ones', async () => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS = { ...options, flags: { cachedPackages: true } };
      const total = 60;
      server.use(
        http.get(PACKAGES_URL, () => HttpResponse.json([pkg('a', 'private'), pkg('b', 'private')])),
        http.get(CACHED_URL, ({ request }) => {
          const params = new URL(request.url).searchParams;
          const offset = Number(params.get('offset'));
          const limit = Number(params.get('limit'));
          const names = Array.from({ length: total }, (_, i) => `cached-${i}`);
          return HttpResponse.json({
            total,
            offset,
            limit,
            packages: names.slice(offset, offset + limit).map((name) => pkg(name, 'cached')),
          });
        })
      );

      await act(async () =>
        renderWithRouter(
          <ManifestsProvider>
            <PagedComponent />
          </ManifestsProvider>,
          RouterPath.ROOT,
          [RouterPath.ROOT]
        )
      );

      await waitFor(() => screen.getByText(`total:${2 + CACHED_PAGE_SIZE}`));
      fireEvent.click(screen.getByText('more'));
      await waitFor(() => screen.getByText(`total:${2 + total}`));
      expect(screen.getByText(`cached:${total}`)).toBeInTheDocument();
    });

    test('should not request cached packages when the flag is off', async () => {
      let cachedRequests = 0;
      server.use(
        http.get(CACHED_URL, () => {
          cachedRequests++;
          return HttpResponse.json({ total: 0, offset: 0, limit: 50, packages: [] });
        })
      );

      await act(async () =>
        renderWithRouter(
          <ManifestsProvider>
            <PagedComponent />
          </ManifestsProvider>,
          RouterPath.ROOT,
          [RouterPath.ROOT]
        )
      );

      await waitFor(() => screen.getByText('cached:0'));
      expect(cachedRequests).toBe(0);
    });
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

  test('polls while the registry is empty and stops once a package arrives', async () => {
    let requests = 0;
    server.use(
      http.get(PACKAGES_URL, () => {
        requests += 1;
        return HttpResponse.json(requests < 2 ? [] : [{ name: 'verdaccio' }]);
      })
    );
    renderWithRouter(
      <ManifestsProvider emptyRefreshMs={50}>
        <CustomComponent />
      </ManifestsProvider>,
      RouterPath.ROOT,
      ['/']
    );
    // SWR dedupes revalidations for 2s, so the second request lands after that window
    await waitFor(() => expect(screen.getByText('packages:1')).toBeInTheDocument(), {
      timeout: 5000,
    });
    const requestsWhenFound = requests;
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(requests).toBe(requestsWhenFound);
  }, 10_000);
});
