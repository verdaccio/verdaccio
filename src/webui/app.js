import React, { Component, Fragment } from 'react';
import isNil from 'lodash/isNil';

import storage from './utils/storage';
import { makeLogin, isTokenExpire } from './utils/login';

import Loading from './components/Loading';
import LoginModal from './components/Login';
import Header from './components/Header';
import { Container, Content } from './components/Layout';
import RouterApp from './router';
import API from './utils/api';
import './styles/typeface-roboto.scss';
import './styles/main.scss';
import 'normalize.css';
import Footer from './components/Footer';

export const AppContext = React.createContext();

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;

export default class App extends Component {
  state = {
    error: {},
    logoUrl: window.VERDACCIO_LOGO,
    user: {},
    scope: (window.VERDACCIO_SCOPE) ? `${window.VERDACCIO_SCOPE}:` : '',
    showLoginModal: false,
    isUserLoggedIn: false,
    packages: [],
    isLoading: true,
  }

  componentDidMount() {
    this.isUserAlreadyLoggedIn();
    this.loadOnHandler();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(_, prevState) {
    const { isUserLoggedIn } = this.state;
    if (prevState.isUserLoggedIn !== isUserLoggedIn) {
      this.loadOnHandler();
    }
  }

  isUserAlreadyLoggedIn = () => {
    // checks for token validity
    const token = storage.getItem('token');
    const username = storage.getItem('username');
    if (isTokenExpire(token) || isNil(username)) {
     this.handleLogout();
    } else {
      this.setState({
        user: { username, token },
        isUserLoggedIn: true,
      });
    }
  }

  loadOnHandler = async () => {
    try {
      this.req = await API.request('packages', 'GET');
      this.setState({
        packages: this.req,
        isLoading: false,
      });
    } catch (error) {
      // FIXME: add dialog
      console.error({
        title: 'Warning',
        message: `Unable to load package list: ${error.message}`,
      });
      this.setLoading(false);
    }
  }

  setLoading = isLoading => (
    this.setState({
      isLoading,
    })
  )

  /**
   * Toggles the login modal
   * Required by: <LoginModal /> <Header />
   */
  handleToggleLoginModal = () => {
    this.setState((prevState) => ({
      showLoginModal: !prevState.showLoginModal,
      error: {},
    }));
  }

  /**
   * handles login
   * Required by: <Header />
   */
  handleDoLogin = async (usernameValue, passwordValue) => {
    const { username, token, error } = await makeLogin(
      usernameValue,
      passwordValue
    );

    if (username && token) {
      this.setLoggedUser(username, token);
      storage.setItem('username', username);
      storage.setItem('token', token);
    }

    if (error) {
      this.setState({
        user: {},
        error,
      });
    }
  }

  setLoggedUser = (username, token) => {
    this.setState({
      user: {
        username,
        token,
      },
      isUserLoggedIn: true,  // close login modal after successful login
      showLoginModal: false,  // set isUserLoggedIn to true
    });
  }
  /**
   * Logouts user
   * Required by: <Header />
   */
  handleLogout = () => {
    storage.removeItem('username');
    storage.removeItem('token');
    this.setState({
      user: {},
      isUserLoggedIn: false,
    });
  }

  render() {
    const { isLoading, isUserLoggedIn, packages, logoUrl, user, scope } = this.state;
    return (
      <Container isLoading={isLoading}>
        {isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <AppContextProvider value={{isUserLoggedIn, packages, logoUrl, user, scope}}>
              {this.renderContent()}
            </AppContextProvider>
          </Fragment>
        )}
        {this.renderLoginModal()}
      </Container>
    );
  }

  renderLoginModal = () => {
    const { error, showLoginModal } = this.state;
    return (
      <LoginModal
        error={error}
        onCancel={this.handleToggleLoginModal}
        onChange={this.handleSetUsernameAndPassword}
        onSubmit={this.handleDoLogin}
        visibility={showLoginModal}
      />
    );
  }

  renderContent = () => {
    return (
      <Fragment>
        <Content>
          <RouterApp 
            onLogout={this.handleLogout}
            onToggleLoginModal={this.handleToggleLoginModal}>
            {this.renderHeader()}
          </RouterApp>
        </Content>
        <Footer />
      </Fragment>
    );
  }

  renderHeader = () => {
    const { logoUrl, user, scope } = this.state;

    return (
      <Header
        logo={logoUrl}
        onLogout={this.handleLogout}
        onToggleLoginModal={this.handleToggleLoginModal}
        scope={scope}
        username={user.username}
      />
    );
  }
}
