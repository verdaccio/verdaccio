/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { store } from '../../store';
import { act, renderWith, screen, waitFor } from '../../test/test-react-testing-library';
import Home from './Home';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

const ComponentHome: React.FC = () => (
  <MemoryRouter>
    <Home />
  </MemoryRouter>
);

describe('Home', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render titles', async () => {
    act(() => {
      renderWith(<ComponentHome />, store);
    });
    await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(5));
  });

  test('should render loading', async () => {
    act(() => {
      renderWith(<ComponentHome />, store);
    });
    await waitFor(() => expect(screen.getByTestId('loading')).toBeInTheDocument());
  });
});
