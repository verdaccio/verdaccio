import React from 'react';
import { vi } from 'vitest';

import { act, renderWith, screen } from '../utils/test-react-testing-library';

vi.mock('@verdaccio/ui-components', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    Header: () => <div data-testid="header">Header</div>,
    Footer: () => <div data-testid="footer">Footer</div>,
    SearchProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('./AppRoute', () => ({
  default: () => <div data-testid="app-route">AppRoute</div>,
}));

vi.mock('react-router', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' }),
  };
});

const { AppContent } = await import('./App');

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

describe('<App />', () => {
  describe('footer', () => {
    test('should display the Footer component', async () => {
      await act(() => {
        renderWith(<AppContent />);
      });
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('should not display the Footer component', async () => {
      // @ts-expect-error __VERDACCIO_BASENAME_UI_OPTIONS is a global set by the server
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        // @ts-expect-error __VERDACCIO_BASENAME_UI_OPTIONS is a global set by the server
        ...window.__VERDACCIO_BASENAME_UI_OPTIONS,
        showFooter: false,
      };
      await act(() => {
        renderWith(<AppContent />);
      });
      expect(screen.queryByTestId('footer')).toBeFalsy();
    });
  });
});
