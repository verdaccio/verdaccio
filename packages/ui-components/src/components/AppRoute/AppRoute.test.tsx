import React from 'react';
import { describe, expect, test, vi } from 'vitest';

import { MemoryRouter, renderWith, screen, waitFor } from '../../test/test-react-testing-library';
import AppRoute from './AppRoute';

vi.mock('../../store/api', () => ({
  default: {
    request: vi.fn().mockResolvedValue({ items: [], page: 0, perPage: 10, total: 0 }),
  },
}));

// this file is about which routes resolve, not about what the pages render.
// Stubbing them keeps the real pages' deep MUI imports out of the lazy chunk,
// which otherwise resolve after vitest tears the environment down, and avoids
// depending on the session the real pages require.
vi.mock('../../pages/Stage/StageList', () => ({
  default: () => <div>stage-list-route</div>,
}));
vi.mock('../../pages/Stage/StageDetail', () => ({
  default: () => <div>stage-detail-route</div>,
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
  test('should not resolve the stage route when the flag is off', async () => {
    renderAt('/-/web/stage', { stage: false });

    await waitFor(() =>
      expect(screen.getByText('error.404.sorry-we-could-not-find-it')).toBeInTheDocument()
    );
  });

  test('should resolve the stage route when the flag is on', async () => {
    renderAt('/-/web/stage', { stage: true });

    await waitFor(() => expect(screen.getByText('stage-list-route')).toBeInTheDocument());
  });

  test('should resolve the stage detail route when the flag is on', async () => {
    renderAt('/-/web/stage/8f6d5b3c-1a2e-4f7b-9c0d-1e2f3a4b5c6d', { stage: true });

    await waitFor(() => expect(screen.getByText('stage-detail-route')).toBeInTheDocument());
  });
});
