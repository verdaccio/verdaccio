import { HttpResponse, http } from 'msw';
import React from 'react';

import { server } from '../../../vitest/server';
import {
  RouterPath,
  act,
  cleanup,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import VersionProvider, { useVersion } from './VersionProvider';

function ErrorProbe() {
  const { isError, isLoading, packageMeta } = useVersion();

  return isLoading ? (
    <div>{'loading ...'}</div>
  ) : (
    <div>{`${isError ? 'has-error' : 'no-error'}:${packageMeta ? 'meta' : 'no-meta'}`}</div>
  );
}

function CustomComponent() {
  const { isLoading, packageMeta, packageName, packageVersion } = useVersion();

  return isLoading ? (
    <div>{'loading ...'}</div>
  ) : (
    <div>
      <div>{'readme:'}</div>
      <div>
        {'packageMeta:'}
        {packageMeta?.latest?.name}
      </div>
      <div>
        {'packageName:'}
        {packageName}
      </div>
      <div>
        {'packageVersion:'}
        {packageVersion}
      </div>
    </div>
  );
}

describe('<VersionProvider />', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load data from the provider', async () => {
    await act(async () =>
      renderWithRouter(
        <VersionProvider>
          <CustomComponent />
        </VersionProvider>,
        RouterPath.PACKAGE_VERSION,
        ['/-/web/detail/jquery/v/1.5.1']
      )
    );
    await waitFor(() => {
      screen.queryAllByText('jquery', { exact: false });
      screen.queryAllByText('1.5.1', { exact: false });
    });
  });

  test('a readme-only failure must not flag the whole page as error', async () => {
    server.use(
      http.get('http://localhost:9000/-/verdaccio/data/package/readme/*', () =>
        HttpResponse.error()
      )
    );
    await act(async () =>
      renderWithRouter(
        <VersionProvider>
          <ErrorProbe />
        </VersionProvider>,
        RouterPath.PACKAGE,
        ['/-/web/detail/jquery']
      )
    );
    await waitFor(() => screen.getByText('no-error:meta'));
  });

  test('a sidebar failure flags the page as error', async () => {
    server.use(
      http.get('http://localhost:9000/-/verdaccio/data/sidebar/*', () => HttpResponse.error())
    );
    await act(async () =>
      renderWithRouter(
        <VersionProvider>
          <ErrorProbe />
        </VersionProvider>,
        RouterPath.PACKAGE,
        ['/-/web/detail/jquery']
      )
    );
    await waitFor(() => screen.getByText('has-error:no-meta'));
  });
});
