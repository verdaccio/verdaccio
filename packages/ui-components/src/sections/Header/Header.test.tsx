import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { HeaderInfoDialog, store } from '../../';
import {
  act,
  cleanup,
  fireEvent,
  renderWithStore,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../test/test-react-testing-library';
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
  });

  test('should load the component in logged out state', () => {
    renderWithStore(
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
    renderWithStore(
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
    renderWithStore(
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
    const { getByText, getByTestId, findByText, findByTestId } = renderWithStore(
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
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('header--tooltip-info')).toBeInTheDocument();
  });

  test('should display settings button', () => {
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('header--tooltip-settings')).toBeInTheDocument();
  });

  test('should display light button switch', () => {
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('header--button--light')).toBeInTheDocument();
  });

  test.todo('should test display dark button switch');

  test('should display search box', () => {
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );
    expect(screen.getByTestId('search-container')).toBeInTheDocument();
  });

  test('should open the registrationInfo modal when clicking on the info icon', async () => {
    renderWithStore(
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
    const { getByTestId, findByText, queryByTestId } = renderWithStore(
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
    // @ts-expect-error
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      login: false,
    };
    renderWithStore(
      <Router>
        <Header HeaderInfoDialog={CustomInfoDialog} />
      </Router>,
      store
    );

    expect(screen.queryByTestId('header--button-login')).toBeNull();
  });

  test('should hide search if is disabled', () => {
    // @ts-expect-error
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSearch: false,
    };
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTestId('search-container')).toBeNull();
  });

  test('should hide settings if is disabled', () => {
    // @ts-expect-error
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSettings: false,
    };
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTitle('header--tooltip-settings')).toBeNull();
  });

  test('should hide info if is disabled', () => {
    // @ts-expect-error
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showSettings: false,
    };
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTitle('header.registry-info')).toBeNull();
  });

  test('should hide theme switch if is disabled', () => {
    // @ts-expect-error
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      base: 'foo',
      showThemeSwitch: false,
    };
    renderWithStore(
      <Router>
        <Header />
      </Router>,
      store
    );

    expect(screen.queryByTitle('header.registry-info')).toBeNull();
  });

  test.todo('autocompletion should display suggestions according to the type value');
});
