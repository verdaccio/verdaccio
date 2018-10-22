import React, { Component, Fragment } from 'react';
import isNil from 'lodash/isNil';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

import storage from './utils/storage';
import logo from './utils/logo';
import { makeLogin, isTokenExpire } from './utils/login';

import Footer from './components/Footer';
import Loading from './components/Loading';
import LoginModal from './components/Login';
import Header from './components/Header';
import { Container, Content } from './components/Layout';
import Route from './router';
import API from './utils/api';
import { getDetailPageURL } from './utils/url';

import './styles/main.scss';
import classes from "./app.scss";
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
    searchPackages: [],
    filteredPackages: [],
    search: '',
    isLoading: true,
    showAlertDialog: false,
    alertDialogContent: {
      title: '',
      message: '',
      packages: []
    },
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
    if (isTokenExpire(token) || isNil(username)) {
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
        filteredPackages: transformedPackages,
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
      showLoginModal: false  // set isUserLoggedin to true
    });
  }

  handleFetchPackages = async ({ value }) => {
    try {
      this.req = await API.request(`/search/${encodeURIComponent(value)}`, 'GET');
      const transformedPackages = this.req.map(({ name, ...others}) => ({
        label: name,
        ...others
      }));
      // Implement cancel feature later
      if (this.state.search === value) {
        this.setState({
          searchPackages: transformedPackages
        });
      }
    } catch (error) {
      this.handleShowAlertDialog({
        title: 'Warning',
        message: `Unable to get search result: ${error.message}`
      });
    }
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

  handlePackagesClearRequested = () => {
    this.setState({
      searchPackages: []
    });
  };

   // eslint-disable-next-line no-unused-vars
   handleSearch = (_, { newValue }) => {
    const { filteredPackages, packages, search } = this.state;
    const value = newValue.trim();
    this.setState({
      search: value,
      filteredPackages: value.length < search.length ? 
        packages.filter(pkg => pkg.label.match(value)) : filteredPackages
    });
  };

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      const { filteredPackages, packages } = this.state;
      const value = event.target.value.trim();
      this.setState({
        filteredPackages: value ? 
        packages.filter(pkg => pkg.label.match(value)) : filteredPackages
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleClickSearch = (_, { suggestionValue, method }) => {
    const { packages } = this.state;
    switch(method) {
      case 'click':
        window.location.href = getDetailPageURL(suggestionValue);
      break;
      case 'enter':
        this.setState({
          filteredPackages: packages.filter(pkg => pkg.label.match(suggestionValue))
        });
      break;
    }
  }

  handleShowAlertDialog = content => {
    this.setState({
      showAlertDialog: true,
      alertDialogContent: content
    });
  }

  handleDismissAlertDialog = () => {
    this.setState({
      showAlertDialog: false
    });
  };

  getfilteredPackages = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    if (inputLength === 0) {
      return [];
    } else {
      return this.searchPackage(value);
    }
  }

  renderHeader = () => {
    const { logoUrl, user, search, searchPackages } = this.state;
    return (
      <Header 
        logo={logoUrl}
        username={user.username}
        toggleLoginModal={this.toggleLoginModal}
        onLogout={this.handleLogout}
        onSearch={this.handleSearch}
        onSuggestionsFetch={this.handleFetchPackages}
        onCleanSuggestions={this.handlePackagesClearRequested}
        onClick={this.handleClickSearch}
        onKeyDown={this.handleKeyDown}
        packages={searchPackages}
        search={search}
      />
    );
  }
  
  renderAlertDialog = () => (
    <Dialog
      open={this.state.showAlertDialog}
      onClose={this.handleDismissAlertDialog}
    >
      <DialogTitle id="alert-dialog-title">
        {this.state.alertDialogContent.title}
      </DialogTitle>
      <DialogContent>
        <SnackbarContent
          className={classes.alertError}
          message={
            <div
              id="client-snackbar"
              className={classes.alertErrorMsg}
            >
              <ErrorIcon className={classes.alertIcon} />
              <span>
                {this.state.alertDialogContent.message}
              </span>
            </div>
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={this.handleDismissAlertDialog}
          color="primary"
          autoFocus
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )

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
    const { isLoading, ...others } = this.state;
    return (
      <Container isLoading={isLoading}>
        {isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {this.renderHeader()}
            <Content>
              <Route {...others} />
            </Content>
            <Footer />
          </Fragment>
        )}
        {this.renderAlertDialog()}
        {this.renderLoginModal()}
      </Container>
    );
  }
}
