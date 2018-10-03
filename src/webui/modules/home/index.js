import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';

import API from '../../utils/api';

import PackageList from '../../components/PackageList';
import Search from '../../components/Search';
import Spinner from '../../components/Spinner';

import classes from "./home.scss";

class Home extends Component {
  static propTypes = {
    children: PropTypes.element,
    isUserLoggedIn: PropTypes.bool
  };

  state = {
    showAlertDialog: false,
    alertDialogContent: {
      title: '',
      message: ''
    },
    loading: true,
    fistTime: true,
    query: ''
  };

  constructor(props) {
    super(props);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleShowAlertDialog = this.handleShowAlertDialog.bind(this);
    this.handleCloseAlertDialog = this.handleCloseAlertDialog.bind(this);
    this.searchPackage = debounce(this.searchPackage, 800);
  }

  componentDidMount() {
    this.loadPackages();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      if (this.req && this.req.abort) this.req.abort();
      this.setState({
        loading: true
      });

      if (prevState.query !== '' && this.state.query === '') {
        this.loadPackages();
      } else {
        this.searchPackage(this.state.query);
      }
    }

    if (prevProps.isUserLoggedIn !== this.props.isUserLoggedIn) {
      this.loadPackages();
    }
  }

  async loadPackages() {
    try {
      this.req = await API.request('packages', 'GET');

      if (this.state.query === '') {
        this.setState({
          packages: this.req,
          loading: false
        });
      }
    } catch (error) {
      this.handleShowAlertDialog({
        title: 'Warning',
        message: `Unable to load package list: ${error.error}`
      });
    }
  }

  async searchPackage(query) {
    try {
      this.req = await API.request(`/search/${query}`, 'GET');

      // Implement cancel feature later
      if (this.state.query === query) {
        this.setState({
          packages: this.req,
          fistTime: false,
          loading: false
        });
      }
    } catch (err) {
      this.handleShowAlertDialog({
        title: 'Warning',
        message: 'Unable to get search result, please try again later.'
      });
    }
  }

  renderAlertDialog() {
    return (
      <Dialog
        open={this.state.showAlertDialog}
        onClose={this.handleCloseAlertDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {this.state.alertDialogContent.title}
        </DialogTitle>
        <DialogContent>
          <SnackbarContent
            className={classes.alertError}
            aria-describedby="client-snackbar"
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
            onClick={this.handleCloseAlertDialog}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleShowAlertDialog(content) {
    this.setState({
      showAlertDialog: true,
      alertDialogContent: content
    });
  };

  handleCloseAlertDialog() {
    this.setState({
      showAlertDialog: false
    });
  };

  handleSearchInput(e) {
    this.setState({
      query: e.target.value.trim()
    });
  }

  isTherePackages() {
    return isEmpty(this.state.packages);
  }

  render() {
    const { packages, loading } = this.state;
    return (
      <Fragment>
        {this.renderSearchBar()}
        {loading ? (
          <Spinner centered />
        ) : (
            <PackageList help={isEmpty(packages) === true} packages={packages} />
          )}
        {this.renderAlertDialog()}
      </Fragment>
    );
  }

  renderSearchBar() {
    if (this.isTherePackages() && this.state.fistTime) {
      return;
    }
    return <Search handleSearchInput={this.handleSearchInput} />;
  }
}

export default Home;
