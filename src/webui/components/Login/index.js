import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import classes from "./login.scss";

export default class LoginModal extends Component {
  static propTypes = {
    visibility: PropTypes.bool,
    error: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    visibility: true,
    error: {},
    onCancel: () => {},
    onSubmit: () => {}
  }

  constructor(props) {
    super(props);
    this.submitCredentials = this.submitCredentials.bind(this);
    this.setCredentials = this.setCredentials.bind(this);
    this.validateCredentials = this.validateCredentials.bind(this);
    this.state = {
      form: {
        username: {
          required: true,
          pristine: true,
          helperText: 'Field required',
          value: ''
        },
        password:  {
          required: true,
          pristine: true,
          helperText: 'Field required',
          value: ''
        },
      },
      error: props.error
    };
  }

  /**
   * set login modal's username and password to current state
   * Required to login
   */
  setCredentials(name, e) {
    this.setState({
      form: {
        ...this.state.form,
        [name]: {
          ...this.state.form[name],
          value: e.target.value,
          pristine: false
        }
      }
    });
  }

  validateCredentials(event) {
    // prevents default submit behavior
    event.preventDefault();

    this.setState({
      form: Object.keys(this.state.form).reduce((acc, key) => ({
        ...acc,
        ...{ [key]: {...this.state.form[key], pristine: false } }
      }), {})
    }, () => {
      if (!Object.keys(this.state.form).some(id => !this.state.form[id])) {
        this.submitCredentials();
      }
    });
  }

  async submitCredentials() {
    const { form: { username, password } } = this.state;
    await this.props.onSubmit(username.value, password.value);
    // let's wait for API response and then set
    // username and password filed to empty state
    this.setState({
     form: Object.keys(this.state.form).reduce((acc, key) => ({
      ...acc,
      ...{ [key]: {...this.state.form[key], value: "", pristine: true } }
    }), {})
    });
  }

  renderLoginError({ type, title, description } = {}) {
    return type === 'error' && (
      <SnackbarContent
        className={classes.loginError}
        message={
          <div
            id="client-snackbar"
            className={classes.loginErrorMsg}
          >
            <ErrorIcon className={classes.loginIcon} />
            <span>
              <div><strong>{title}</strong></div>
              <div>{description}</div>
            </span>
          </div>
        }
      />
    );
  }

  render() {
    const { visibility, onCancel, error } = this.props;
    const { form: { username, password } } = this.state;
    return (
        <Dialog
          onClose={onCancel}
          open={visibility}
          id="login--form-container"
          maxWidth="xs"
          fullWidth
        >
        <form onSubmit={this.validateCredentials.bind(this)} noValidate>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            {this.renderLoginError(error)}
            <FormControl
              error={!username.value && !username.pristine}
              required={username.required}
              fullWidth
            >
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="login--form-username"
                value={username.value}
                onChange={this.setCredentials.bind(this, 'username')}
                placeholder="Your username"
              />
              {!username.value && !username.pristine && (
                <FormHelperText id='username-error'>
                  {username.helperText}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              error={!password.value && !password.pristine}
              required={password.required}
              style={{ marginTop: '8px' }}
              fullWidth
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="login--form-password"
                type="password"
                value={password.value}
                onChange={this.setCredentials.bind(this, 'password')}
                placeholder="Your strong password"
              />
              {!password.value && !password.pristine && (
                <FormHelperText id='password-error'>
                  {password.helperText}
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions className="dialog-footer">
            <Button
              onClick={onCancel}
              id="login--form-cancel"
              color="inherit"
              type="button"
            >
              Cancel
              </Button>
            <Button
              id="login--form-submit"
              type="submit"
              color="inherit"
              disabled={ !password.value || !username.value }
            >
              Login
            </Button>
          </DialogActions>
          </form>
        </Dialog>
    );
  }
}
