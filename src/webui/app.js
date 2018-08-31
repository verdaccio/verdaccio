import React, {Component} from 'react';
import isNil from 'lodash/isNil';
import 'element-theme-default';
import {i18n} from 'element-react';
import locale from 'element-react/src/locale/lang/en';

import storage from './utils/storage';
import logo from './utils/logo';
import {makeLogin, isTokenExpire} from './utils/login';

import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/Login';

i18n.use(locale);

import Route from './router';

import './styles/main.scss';
import 'normalize.css';

export default class App extends Component {
  state = {
    error: {},
    logoUrl: '',
    user: {},
    scope: (window.VERDACCIO_SCOPE) ? `${window.VERDACCIO_SCOPE}:` : '',
    showLoginModal: false,
    isUserLoggedIn: false
  };

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.loadLogo = this.loadLogo.bind(this);
    this.isUserAlreadyLoggedIn = this.isUserAlreadyLoggedIn.bind(this);
  }

  componentDidMount() {
    this.loadLogo();
    this.isUserAlreadyLoggedIn();
  }

  isUserAlreadyLoggedIn() {
    // checks for token validity
    const token = storage.getItem('token');
    const username = storage.getItem('username');

    if (isTokenExpire(token) || isNil(username)) {
      this.handleLogout();
    } else {
      this.setState({
        user: {username, token},
        isUserLoggedIn: true
      });
    }
  }

  async loadLogo() {
    const logoUrl = await logo();
    this.setState({logoUrl});
  }

  /**
   * Toggles the login modal
   * Required by: <LoginModal /> <Header />
   */
  toggleLoginModal() {
    this.setState((prevState) => ({
      showLoginModal: !prevState.showLoginModal,
      error: {}
    }));
  }

  /**
   * handles login
   * Required by: <Header />
   */
  async doLogin(usernameValue, passwordValue) {
    const {username, token, error} = await makeLogin(
      usernameValue,
      passwordValue
    );

    if (username && token) {
      this.setState({
        user: {
          username,
          token
        }
      });
      storage.setItem('username', username);
      storage.setItem('token', token);
      // close login modal after successful login
      // set isUserLoggedin to true
      this.setState({
        isUserLoggedIn: true,
        showLoginModal: false
      });
    }

    if (error) {
      this.setState({
        user: {},
        error
      });
    }
  }

  /**
   * Logouts user
   * Required by: <Header />
   */
  handleLogout() {
    storage.removeItem('username');
    storage.removeItem('token');
    this.setState({
      user: {},
      isUserLoggedIn: false
    });
  }

  renderHeader() {
    const {
      logoUrl,
      user,
      scope,
    } = this.state;
    return <Header
      logo={logoUrl}
      username={user.username}
      scope={scope}
      toggleLoginModal={this.toggleLoginModal}
      handleLogout={this.handleLogout}
    />;
  }

  renderLoginModal() {
    const {
      error,
      showLoginModal
    } = this.state;
    return <LoginModal
      visibility={showLoginModal}
      error={error}
      onChange={this.setUsernameAndPassword}
      onCancel={this.toggleLoginModal}
      onSubmit={this.doLogin}
    />;
  }

  render() {
    const {isUserLoggedIn} = this.state;
    return (
      <div className="page-full-height">
          {this.renderHeader()}
          {this.renderLoginModal()}
          <Route isUserLoggedIn={isUserLoggedIn} />
        <Footer />
      </div>
    );
  }
}
