import React from 'react';

import {
  RouterPath,
  act,
  cleanup,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import ManifestsProvider, { useManifests } from './ManifestsProvider';

function CustomComponent() {
  const { isLoading, manifests } = useManifests();

  return isLoading ? (
    <div>{'loading ...'}</div>
  ) : (
    <div>
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
});
