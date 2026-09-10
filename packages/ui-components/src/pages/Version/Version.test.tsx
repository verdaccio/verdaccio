import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';

import { mockSidebar } from '../../../vitest/msw-utils';
import { server } from '../../../vitest/server';
import {
  RouterPath,
  act,
  cleanup,
  renderWithRouter,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import { VersionProvider } from '../../providers/VersionProvider';
import Version from './Version';

describe('<Version /> page', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render the layout when the manifest loads', async () => {
    await act(async () =>
      renderWithRouter(
        <VersionProvider>
          <Version />
        </VersionProvider>,
        RouterPath.PACKAGE_VERSION,
        ['/-/web/detail/jquery/v/1.5.1']
      )
    );
    await waitFor(() => {
      expect(screen.queryByTestId('generic-error')).not.toBeInTheDocument();
    });
  });

  test('should render a generic error instead of a blank page when the sidebar request fails', async () => {
    server.use(mockSidebar('jquery', undefined, 500));

    await act(async () =>
      renderWithRouter(
        <VersionProvider>
          <Version />
        </VersionProvider>,
        RouterPath.PACKAGE_VERSION,
        ['/-/web/detail/jquery/v/1.5.1']
      )
    );

    await waitFor(() => {
      expect(screen.getByTestId('generic-error')).toBeInTheDocument();
    });
  });
});
