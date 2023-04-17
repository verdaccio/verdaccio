import React from 'react';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { Route as Routes, store } from '../../';
import {
  act,
  cleanup,
  renderWithStore,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import VersionProvider, { useVersion } from './VersionProvider';

function CustomComponent() {
  const { packageMeta, packageName, packageVersion } = useVersion();
  return (
    <div>
      <div>{packageMeta?.latest?.license as string}</div>
      <div>{packageName}</div>
      <div>{packageVersion}</div>
    </div>
  );
}

/* eslint-disable react/jsx-no-bind*/
describe('<Header /> component with logged in state', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load data from the provider', async () => {
    await act(async () => {
      renderWithStore(
        <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
          <Route path={Routes.PACKAGE}>
            <VersionProvider>
              <CustomComponent />
            </VersionProvider>
          </Route>
        </MemoryRouter>,
        store
      );
    });
    await waitFor(() => screen.getByText('storybook'));
    expect(screen.getByText('storybook')).toBeInTheDocument();
    expect(screen.getByText('MIT')).toBeInTheDocument();
  });
});
