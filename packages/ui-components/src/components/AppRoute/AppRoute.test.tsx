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
    // AppRoute loads the stage pages lazily. Without warming the chunk here its
    // transitive imports (MUI icons) keep resolving after the test environment
    // is torn down, which vitest reports as an unhandled error.
    await import('../../pages/Stage/StageList');
    await import('../../pages/Stage/StageDetail');
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
