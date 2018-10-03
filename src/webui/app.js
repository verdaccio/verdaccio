import React, { Component } from 'react';
import isNil from 'lodash/isNil';
import deburr from 'lodash/deburr';
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
import Spinner from './components/Spinner';
import LoginModal from './components/Login';
import Route from './router';
import API from './utils/api';

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
    search: "",
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
      const packages = await API.request('packages', 'GET');
      const transformedPackages = packages.map(({ name, ...others}) => ({
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

  handleFetchPackages = ({ value }) => {
    this.setState({
      searchPackages: this.getfilteredPackages(value),
    });
  }

  handlePackagesClearRequested = () => {
    this.setState({
      searchPackages: []
    });
  };

   // eslint-disable-next-line no-unused-vars
   handleSearch = (_, { newValue }) => {
    this.setState({
      search: newValue
    });
  };

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
    const { packages } = this.state;
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
  
    if (inputLength === 0) {
      return [];
    } else {
      return packages.filter(pkge => {
        const keep = count < 5 && (
          pkge.label && pkge.label.slice(0, inputLength).toLowerCase() === inputValue ||
          pkge.version && pkge.version.slice(0, inputLength).toLowerCase() === inputValue ||
          pkge.keywords && pkge.keywords.some(keyword => keyword.slice(0, inputLength).toLowerCase() === inputValue)
        );

        if (keep) {
          count += 1;
        }

        return keep;
      });
    }
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
    const { isLoading, logoUrl, user, ...others } = this.state;
    return (
      <div className="page-full-height">
        {this.renderLoginModal()}
        {isLoading ? (
          <Spinner centered />
        ) : (
          <Route
            {...others}
            logo={logoUrl}
            username={user.username}
            toggleLoginModal={this.toggleLoginModal}
            onLogout={this.handleLogout}
            onSearch={this.handleSearch}
            onSuggestionsFetch={this.handleFetchPackages}
            onCleanSuggestions={this.handlePackagesClearRequested}
          />
        )}
        <Footer />
        {this.renderAlertDialog()}
      </div>
    );
  }
}
