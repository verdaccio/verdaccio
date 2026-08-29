import React from 'react';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { MemoryRouter, renderWith, screen, waitFor } from '../../test/test-react-testing-library';
import AppRoute from './AppRoute';

vi.mock('../../store/api', () => ({
  default: {
    request: vi.fn().mockResolvedValue({ items: [], page: 0, perPage: 10, total: 0 }),
  },
}));

function renderAt(path: string, flags: Record<string, boolean>) {
  return renderWith(
    <MemoryRouter initialEntries={[path]}>
      <AppRoute />
    </MemoryRouter>,
    { flags }
  );
}

describe('<AppRoute /> stage routes', () => {
  beforeAll(async () => {
    // AppRoute loads the stage pages lazily, and vite resolves their deep MUI
    // imports as separate requests that outlive the module evaluation. Left
    // alone they land after vitest tears the environment down, which it reports
    // as an unhandled error. Warming both the pages and the deep modules they
    // pull puts everything in the module cache first.
    await Promise.all([
      import('@mui/material/Alert'),
      import('../../pages/Stage/StageList'),
      import('../../pages/Stage/StageDetail'),
    ]);
  });

  test('should not resolve the stage route when the flag is off', async () => {
    renderAt('/-/web/stage', { stage: false });

    await waitFor(() =>
      expect(screen.getByText('error.404.sorry-we-could-not-find-it')).toBeInTheDocument()
    );
  });

  test('should resolve the stage route when the flag is on', async () => {
    renderAt('/-/web/stage', { stage: true });

    await waitFor(() => expect(screen.getByText('stage.title')).toBeInTheDocument());
  });
});
