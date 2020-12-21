import React from 'react';

import storage from 'verdaccio-ui/utils/storage';
import { render, waitFor, fireEvent } from 'verdaccio-ui/utils/test-react-testing-library';

// eslint-disable-next-line jest/no-mocks-import
import { generateTokenWithTimeRange } from '../../jest/unit/components/__mocks__/token';

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

jest.mock('verdaccio-ui/utils/api', () => ({
  // eslint-disable-next-line jest/no-mocks-import
  request: require('../../jest/unit/components/__mocks__/api').default.request,
}));

/* eslint-disable react/jsx-no-bind*/
describe('<App />', () => {
  // test('should display the Header component ', async () => {
  //   const { queryByTestId } = render(<App />);
  //
  //   expect(queryByTestId('loading')).toBeTruthy();
  //
  //   // wait for the Header component appearance and return the element
  //   const headerElement = await waitFor(() => queryByTestId('header'));
  //   expect(headerElement).toBeTruthy();
  // });

  test('handleLogout - logouts the user and clear localstorage', async () => {
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', generateTokenWithTimeRange(24));

    const { queryByTestId } = render(<App />);

    // wait for the Account's circle element component appearance and return the element
    const accountCircleElement = await waitFor(() => queryByTestId('header--menu-accountcircle'));
    expect(accountCircleElement).toBeTruthy();

    if (accountCircleElement) {
      fireEvent.click(accountCircleElement);

      // wait for the Button's logout element component appearance and return the element
      const buttonLogoutElement = await waitFor(() => queryByTestId('header--button-logout'));
      expect(buttonLogoutElement).toBeTruthy();

      if (buttonLogoutElement) {
        fireEvent.click(buttonLogoutElement);

        expect(queryByTestId('greetings-label')).toBeFalsy();
      }
    }
  });

  test('isUserAlreadyLoggedIn: token already available in storage', async () => {
    storage.setItem('username', 'verdaccio');
    storage.setItem('token', generateTokenWithTimeRange(24));

    const { queryByTestId, queryAllByText } = render(<App />);

    // wait for the Account's circle element component appearance and return the element
    const accountCircleElement = await waitFor(() => queryByTestId('header--menu-accountcircle'));
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
  });
});
