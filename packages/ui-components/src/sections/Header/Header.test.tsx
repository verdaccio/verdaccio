import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';

import { HeaderInfoDialog, store } from '../../';
import {
  act,
  cleanup,
  fireEvent,
  renderWith,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../test/test-react-testing-library';
import * as tokenUtils from '../../utils/token';
import Header from './Header';

function CustomInfoDialog({ onCloseDialog, title, isOpen }) {
  return (
    <HeaderInfoDialog
      dialogTitle={title}
      isOpen={isOpen}
      onCloseDialog={onCloseDialog}
      tabPanels={[
        { element: <div>{'foo'}</div> },
        { element: <div>{'bar'}</div> },
        { element: <div>{'fooBar'}</div> },
      ]}
      tabs={[{ label: 'foo' }, { label: 'bar' }, { label: 'barFoo' }]}
    />
  );
}

/* eslint-disable react/jsx-no-bind*/
describe('<Header /> component with logged in state', () => {
  beforeEach(() => {
    store.dispatch.login.logOutUser();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('should load the component in logged out state', () => {
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTestId('logInDialogIcon')).toBeNull();
    expect(screen.getByText('button.login')).toBeTruthy();
    expect(screen.queryByTestId('header--button-login')).toBeInTheDocument();
  });

  test('should load the component in logged in state', async () => {
    vi.spyOn(tokenUtils, 'isTokenExpire').mockReturnValue(false); // avoid immediate logout due to invalid token
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );
    act(() => {
      store.dispatch.login.logInUser({ username: 'store', token: '12345' });
    });

    await waitFor(() => {
      expect(screen.getByTestId('logInDialogIcon')).toBeTruthy();
      expect(screen.queryByText('button.login')).toBeNull();
    });
  });

  test('should open login dialog', async () => {
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    const loginBtn = screen.getByTestId('header--button-login');
    fireEvent.click(loginBtn);

    const loginDialog = await waitFor(() => screen.findByTestId('login--dialog'));

    expect(loginDialog).toBeTruthy();
  });

  test('should login and logout the user', async () => {
    vi.spyOn(tokenUtils, 'isTokenExpire').mockReturnValue(false); // avoid immediate logout due to invalid token
    const { getByText, getByTestId, findByText, findByTestId } = renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    fireEvent.click(screen.getByText('button.login'));
    const userNameInput = screen.getByPlaceholderText('form-placeholder.username');
    fireEvent.focus(userNameInput);
    fireEvent.change(userNameInput, { target: { value: 'xyz' } });
    const passwordInput = screen.getByPlaceholderText('form-placeholder.password');
    fireEvent.focus(passwordInput);
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: '1234' } });
    });
    const signInButton = screen.getByTestId('login-dialog-form-login-button');
    await act(async () => {
      fireEvent.click(signInButton);
    });
    await waitFor(() => findByTestId('logInDialogIcon'));
    const headerMenuAccountCircle = getByTestId('logInDialogIcon');
    fireEvent.click(headerMenuAccountCircle);

    // // wait for button Logout's appearance and return the element
    const logoutBtn = await waitFor(() => findByText('button.logout'));
    fireEvent.click(logoutBtn);
    await waitFor(() => findByText('button.login'));
    expect(getByText('button.login')).toBeTruthy();
  });

  test('should display info button', () => {
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('header--tooltip-info')).toBeInTheDocument();
  });

  test('should display settings button', () => {
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('header--tooltip-settings')).toBeInTheDocument();
  });

  test('should display light button switch', () => {
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('header--button--light')).toBeInTheDocument();
  });

  test.todo('should test display dark button switch');

  test('should display search box', () => {
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('search-container')).toBeInTheDocument();
  });

  test('should open the registrationInfo modal when clicking on the info icon', async () => {
    renderWith(
      <Router>
        <Header HeaderInfoDialog={CustomInfoDialog} />
      </Router>,
      store
    );

    const infoBtn = screen.getByTestId('header--tooltip-info');
    expect(infoBtn).toBeInTheDocument();
    fireEvent.click(infoBtn);
    // wait for registrationInfo modal appearance and return the element
    const registrationInfoModal = await waitFor(() => screen.findByTestId('registryInfo--dialog'));
    expect(registrationInfoModal).toBeTruthy();
  });

  test('should close the registrationInfo modal when clicking on the button close', async () => {
    const { getByTestId, findByText, queryByTestId } = renderWith(
      <Router>
        <Header HeaderInfoDialog={CustomInfoDialog} />
      </Router>,
      store
    );

    const infoBtn = getByTestId('header--tooltip-info');
    fireEvent.click(infoBtn);

    // wait for Close's button of registrationInfo modal appearance and return the element
    const closeBtn = await waitFor(() => findByText('button.close'));
    fireEvent.click(closeBtn);

    const hasRegistrationInfoModalBeenRemoved = await waitForElementToBeRemoved(() =>
      queryByTestId('registryInfo--dialog')
    );
    expect(hasRegistrationInfoModalBeenRemoved).not.toBeDefined();
  });

  test('should hide login if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      login: false,
    };
    renderWith(
      <Router>
        <Header HeaderInfoDialog={CustomInfoDialog} />
      </Router>,
      store
    );

    expect(screen.queryByTestId('header--button-login')).toBeNull();
  });

  test('should hide search if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSearch: false,
    };
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTestId('search-container')).toBeNull();
  });

  test('should hide settings if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSettings: false,
    };
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTitle('header--tooltip-settings')).toBeNull();
  });

  test('should hide info if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSettings: false,
    };
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTitle('header.registry-info')).toBeNull();
  });

  test('should hide theme switch if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showThemeSwitch: false,
    };
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTitle('header.registry-info')).toBeNull();
  });

  test.todo('autocompletion should display suggestions according to the type value');

  test('should log out user on mount if token is expired', async () => {
    vi.spyOn(tokenUtils, 'isTokenExpire').mockReturnValue(true); // avoid immediate logout due to invalid token
    act(() => {
      store.dispatch.login.logInUser({ username: 'expired', token: 'expired-token' });
    });
    renderWith(
      <Router>
        <Header />
      </Router>,
      store
    );
    await waitFor(() => {
      expect(store.getState().login.username).toBeNull();
      expect(store.getState().login.token).toBeNull();
    });
  });

  test('should log out user after 3 seconds if token expires (mocked interval)', async () => {
    // Use real timers for this test
    const isTokenExpireMock = vi.spyOn(tokenUtils, 'isTokenExpire');
    isTokenExpireMock.mockReturnValue(false);

    act(() => {
      store.dispatch.login.logInUser({ username: 'user', token: 'valid-token' });
    });

    renderWith(
      <Router>
        <Header tokenCheckIntervalMs={1000} />
      </Router>,
      store
    );

    // Set token to expire before the interval fires and wait for the token to expire
    isTokenExpireMock.mockReturnValue(true);
    await new Promise((res) => setTimeout(res, 1500));

    expect(store.getState().login.username).toBeNull();
    expect(store.getState().login.token).toBeNull();
  });
});
