import React from 'react';
import { renderWithStore, screen } from 'verdaccio-ui/utils/test-react-testing-library';

import { store } from '../store';
import App from './App';

jest.mock('verdaccio-ui/utils/storage', () => {
  class LocalStorageMock {
    private store: Record<string, string>;
    public constructor() {
      this.store = {};
    }
    public clear(): void {
      this.store = {};
    }
    public getItem(key: string): unknown {
      return this.store[key] || null;
    }
    public setItem(key: string, value: string): void {
      this.store[key] = value.toString();
    }
    public removeItem(key: string): void {
      delete this.store[key];
    }
  }
  return new LocalStorageMock();
});

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

/* eslint-disable react/jsx-no-bind*/
describe('<App />', () => {
  describe('footer', () => {
    test('should display the Header component', () => {
      renderWithStore(<App />, store);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('should not display the Header component', () => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        showFooter: false,
      };
      renderWithStore(<App />, store);
      expect(screen.queryByTestId('footer')).toBeFalsy();
    });
  });
});
