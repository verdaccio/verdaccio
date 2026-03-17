import React from 'react';

import {
  RouterPath,
  act,
  cleanup,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import VersionProvider, { useVersion } from './VersionProvider';

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
});
