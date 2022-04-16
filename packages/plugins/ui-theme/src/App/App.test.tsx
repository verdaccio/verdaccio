import React from 'react';
import {
  act,
  fireEvent,
  renderWithStore,
  screen,
  waitFor,
} from 'verdaccio-ui/utils/test-react-testing-library';

// eslint-disable-next-line jest/no-mocks-import
import { generateTokenWithTimeRange } from '../../jest/unit/components/__mocks__/token';
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
  describe('login - log out', () => {
    test('handleLogout - logouts the user and clear localstorage', async () => {
      const { queryByTestId } = renderWithStore(<App />, store);
      store.dispatch.login.logInUser({
        username: 'verdaccio',
        token: generateTokenWithTimeRange(24),
      });

      // wait for the Account's circle element component appearance and return the element
      const accountCircleElement = await waitFor(() => queryByTestId('logInDialogIcon'));
      expect(accountCircleElement).toBeTruthy();

      if (accountCircleElement) {
        fireEvent.click(accountCircleElement);

        // wait for the Button's logout element component appearance and return the element
        const buttonLogoutElement = await waitFor(() => queryByTestId('logOutDialogIcon'));
        expect(buttonLogoutElement).toBeTruthy();

        if (buttonLogoutElement) {
          fireEvent.click(buttonLogoutElement);

          expect(queryByTestId('greetings-label')).toBeFalsy();
        }
      }
    }, 10000);

    test('isUserAlreadyLoggedIn: token already available in storage', async () => {
      const { queryByTestId, queryAllByText } = renderWithStore(<App />, store);
      store.dispatch.login.logInUser({
        username: 'verdaccio',
        token: generateTokenWithTimeRange(24),
      });

      // wait for the Account's circle element component appearance and return the element
      const accountCircleElement = await waitFor(() => queryByTestId('logInDialogIcon'));
      expect(accountCircleElement).toBeTruthy();

      if (accountCircleElement) {
        fireEvent.click(accountCircleElement);

        // wait for the Greeting's label element component appearance and return the element
        const greetingsLabelElement = await waitFor(() => queryByTestId('greetings-label'));
        expect(greetingsLabelElement).toBeTruthy();

        if (greetingsLabelElement) {
          expect(queryAllByText('verdaccio')).toBeTruthy();
        }
      }
    }, 10000);
  });

  describe('list packages', () => {
    test('should display the Header component', async () => {
      renderWithStore(<App />, store);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).toBeTruthy();
      });

      // wait for the Header component appearance and return the element
      const headerElement = await waitFor(() => screen.queryByTestId('header'));
      expect(headerElement).toBeTruthy();
    });

    test('should display package lists', async () => {
      act(() => {
        renderWithStore(<App />, store);
      });

      await waitFor(() => {
        expect(screen.getByTestId('package-item-list')).toBeInTheDocument();
      });

      expect(store.getState().packages.response).toHaveLength(1);
    }, 10000);
  });

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
