import React from 'react';
import { vi } from 'vitest';

import { HeaderInfoDialog } from '../../';
import {
  act,
  cleanup,
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../test/test-react-testing-library';
import * as tokenUtils from '../../utils/token';
import Header from './Header';

// custom info dialog to test the info button in the header component
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

async function login(username: string, password: string) {
  fireEvent.click(screen.getByText('button.login'));
  const userNameInput = screen.getByPlaceholderText('form-placeholder.username');
  fireEvent.focus(userNameInput);
  fireEvent.change(userNameInput, { target: { value: username } });
  const passwordInput = screen.getByPlaceholderText('form-placeholder.password');
  fireEvent.focus(passwordInput);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: password } });
  });
  const signInButton = screen.getByTestId('login-dialog-form-login-button');
  await act(async () => {
    fireEvent.click(signInButton);
  });
}

async function logout() {
  const headerMenuAccountCircle = screen.getByTestId('logInDialogIcon');
  fireEvent.click(headerMenuAccountCircle);
  const logoutBtn = await waitFor(() => screen.findByText('button.logout'));
  fireEvent.click(logoutBtn);
}

describe('<Header /> component with logged in state', () => {
  const renderHeader = () => {
    return renderWithRouter(
      <Header HeaderInfoDialog={CustomInfoDialog} />,
      '/-/web/detail/storybook',
      ['/-/web/detail/storybook']
    );
  };

  const originalLocation = window.location;
  beforeAll(() => {
    // Mock window.location with a reload function
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });
  });

  afterAll(() => {
    // server.close();
    // Restore the original window.location object
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // server.resetHandlers();
  });

  test('should load the component in logged out state', () => {
    renderHeader();
    expect(screen.queryByTestId('logInDialogIcon')).toBeNull();
    expect(screen.getByText('button.login')).toBeTruthy();
    expect(screen.queryByTestId('header--button-login')).toBeInTheDocument();
  });

  test('should load the component in logged in state', async () => {
    vi.spyOn(tokenUtils, 'isTokenExpire').mockReturnValue(false);

    renderHeader();
    await login('user', 'token');
    await waitFor(() => {
      expect(screen.getByTestId('logInDialogIcon')).toBeTruthy();
      expect(screen.queryByText('button.login')).toBeNull();
    });
    await logout();
  });

  test('should open login dialog', async () => {
    renderHeader();

    const loginBtn = screen.getByTestId('header--button-login');
    fireEvent.click(loginBtn);

    const loginDialog = await waitFor(() => screen.findByTestId('login--dialog'));

    expect(loginDialog).toBeTruthy();
  });

  test('should login and logout the user', async () => {
    vi.spyOn(tokenUtils, 'isTokenExpire').mockReturnValue(false); // avoid immediate logout due to invalid token
    renderHeader();
    await login('user', 'token');
    expect(screen.getByTestId('logInDialogIcon')).toBeTruthy();
    await logout();
  });

  test('should display info button', () => {
    renderHeader();
    expect(screen.getByTestId('header--tooltip-info')).toBeInTheDocument();
  });

  test('should display settings button', () => {
    renderHeader();
    expect(screen.getByTestId('header--tooltip-settings')).toBeInTheDocument();
  });

  test('should display light button switch', () => {
    renderHeader();
    expect(screen.getByTestId('header--button--light')).toBeInTheDocument();
  });

  test.todo('should test display dark button switch');

  test('should display search box', () => {
    renderHeader();
    expect(screen.getByTestId('search-container')).toBeInTheDocument();
  });

  test('should open the registrationInfo modal when clicking on the info icon', async () => {
    renderHeader();

    const infoBtn = screen.getByTestId('header--tooltip-info');
    expect(infoBtn).toBeInTheDocument();
    fireEvent.click(infoBtn);
    // wait for registrationInfo modal appearance and return the element
    const registrationInfoModal = await waitFor(() => screen.findByTestId('registryInfo--dialog'));
    expect(registrationInfoModal).toBeTruthy();
  });

  test('should close the registrationInfo modal when clicking on the button close', async () => {
    const { getByTestId, findByText, queryByTestId } = renderHeader();

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
    renderHeader();

    expect(screen.queryByTestId('header--button-login')).toBeNull();
  });

  test('should hide search if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSearch: false,
    };
    renderHeader();
    expect(screen.queryByTestId('search-container')).toBeNull();
  });

  test('should hide settings if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSettings: false,
    };
    renderHeader();

    expect(screen.queryByTitle('header--tooltip-settings')).toBeNull();
  });

  test('should hide info if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSettings: false,
    };
    renderHeader();

    expect(screen.queryByTitle('header.registry-info')).toBeNull();
  });

  test('should hide theme switch if is disabled', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showThemeSwitch: false,
    };
    renderHeader();

    expect(screen.queryByTitle('header.registry-info')).toBeNull();
  });

  test.todo('autocompletion should display suggestions according to the type value');

  test.todo('token expiration and auto logout');
});
