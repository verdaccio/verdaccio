import React from 'react';
import { vi } from 'vitest';

import { act, renderWith, screen } from '../utils/test-react-testing-library';
import App from './App';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

/* eslint-disable react/jsx-no-bind*/
describe('<App />', () => {
  describe('footer', () => {
    test('should display the Footer component', async () => {
      await act(() => {
        renderWith(<App />);
      });
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('should not display the Footer component', async () => {
      // @ts-ignore
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        showFooter: false,
      };
      await act(() => {
        renderWith(<App />);
      });
      expect(screen.queryByTestId('footer')).toBeFalsy();
    });
  });
});
