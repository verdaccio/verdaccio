import React, { Component, Fragment } from 'react';
import isNil from 'lodash/isNil';

import storage from './utils/storage';
import logo from './utils/logo';
import {makeLogin} from './utils/login';

import Footer from './components/Footer';
import Loading from './components/Loading';
import LoginModal from './components/Login';
import Header from './components/Header';
import { Container, Content } from './components/Layout';
import Route from './router';
import API from './utils/api';

import './styles/main.scss';
import 'normalize.css';

export default class App extends Component {
  state = {
    error: {},
    logoUrl: '',
    user: {},
    scope: (window.VERDACCIO_SCOPE) ? `${window.VERDACCIO_SCOPE}:` : '',
    showLoginModal: false,
    isUserLoggedIn: false,
    packages: [],
    isLoading: true,
  }

  componentDidMount() {
    this.loadLogo();
    this.isUserAlreadyLoggedIn();
    this.loadPackages();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(_, prevState) {
    if (prevState.isUserLoggedIn !== this.state.isUserLoggedIn) {
      this.loadPackages();
    }
  }

  loadLogo = async () => {
    const logoUrl = await logo();
    this.setState({ 
      logoUrl 
    });
  }

  isUserAlreadyLoggedIn = () => {
    // checks for token validity
    const token = storage.getItem('token');
    const username = storage.getItem('username');

    if (isNil(token) || isNil(username)) {
      this.handleLogout();
    } else {
      this.setState({
        user: { username, token },
        isUserLoggedIn: true
      });
    }
  }

  loadPackages = async () => {
    try {
      this.req = await API.request('packages', 'GET');
      const transformedPackages = this.req.map(({ name, ...others}) => ({
        label: name,
        ...others
      }));
      this.setState({
        packages: transformedPackages, 
        isLoading: false
      });
    } catch (error) {
      this.handleShowAlertDialog({
        title: 'Warning',
        message: `Unable to load package list: ${error.message}`
      });
      this.setLoading(false);
    }
  }

  setLoading = isLoading => (
    this.setState({
      isLoading
    })
  )

  /**
   * Toggles the login modal
   * Required by: <LoginModal /> <Header />
   */
  toggleLoginModal = () => {
    this.setState((prevState) => ({
      showLoginModal: !prevState.showLoginModal,
      error: {}
    }));
  }

  /**
   * handles login
   * Required by: <Header />
   */
  doLogin = async (usernameValue, passwordValue) => {
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
        error
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
      showLoginModal: false  // set isUserLoggedIn to true
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
      isUserLoggedIn: false
    });
  }

  renderHeader = () => {
    const { logoUrl, user, scope } = this.state;
    return (
      <Header 
        logo={logoUrl}
        username={user.username}
        toggleLoginModal={this.toggleLoginModal}
        onLogout={this.handleLogout}
        scope={scope}
      />
    );
  }
  
  renderLoginModal = () => {
    const { error, showLoginModal } = this.state;
    return (
      <LoginModal
        visibility={showLoginModal}
        error={error}
        onChange={this.setUsernameAndPassword}
        onCancel={this.toggleLoginModal}
        onSubmit={this.doLogin}
      />
    );
  }

  render() {
    const { isLoading, isUserLoggedIn, packages } = this.state;
    return (
      <Container isLoading={isLoading}>
        {isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {this.renderHeader()}
            <Content>
              <Route isUserLoggedIn={isUserLoggedIn} packages={packages} />
            </Content>
            <Footer />
          </Fragment>
        )}
        {this.renderLoginModal()}
      </Container>
    );
  }
}
