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
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    error: {},
    onCancel: () => {},
    onSubmit: () => {},
    visibility: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: {
          required: true,
          pristine: true,
          helperText: 'Field required',
          value: '',
        },
        password:  {
          required: true,
          pristine: true,
          helperText: 'Field required',
          value: '',
        },
      },
      error: props.error,
    };
  }

  /**
   * set login modal's username and password to current state
   * Required to login
   */
  setCredentials = (name, e) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: {
          ...this.state.form[name],
          value: e.target.value,
          pristine: false,
        },
      },
    });
  }

  setUsername = (event) => {
    this.setCredentials('username', event);
  }

  setPassword = (event) => {
    this.setCredentials('password', event);
  }

  validateCredentials = (event) => {
    // prevents default submit behavior
    event.preventDefault();

    this.setState({
      form: Object.keys(this.state.form).reduce((acc, key) => ({
        ...acc,
        ...{ [key]: {...this.state.form[key], pristine: false } },
      }), {}),
    }, () => {
      if (!Object.keys(this.state.form).some(id => !this.state.form[id])) {
        this.submitCredentials();
      }
    });
  }

  submitCredentials = async () => {
    const { form: { username, password } } = this.state;
    await this.props.onSubmit(username.value, password.value);
    // let's wait for API response and then set
    // username and password filed to empty state
    this.setState({
     form: Object.keys(this.state.form).reduce((acc, key) => ({
      ...acc,
      ...{ [key]: {...this.state.form[key], value: "", pristine: true } },
    }), {}),
    });
  }

  renderErrorMessage(title, description) {
    return (
      <span>
        <div>
          <strong>
            {title}
          </strong>
        </div>
        <div>
          {description}
        </div>
      </span>);
  }

  renderMessage(title, description) {
    return (
      <div
        className={classes.loginErrorMsg}
        id={"client-snackbar"}>
        <ErrorIcon className={classes.loginIcon} />
        {this.renderErrorMessage(title, description)}
      </div>);
  }

  renderLoginError({ type, title, description } = {}) {
    return type === 'error' && (
      <SnackbarContent
        className={classes.loginError}
        message={this.renderMessage(title, description)}
      />
    );
  }

  renderNameField = () => {
    const { form: { username } } = this.state;
    return (
      <FormControl
        error={!username.value && !username.pristine}
        fullWidth={true}
        required={username.required}
      >
        <InputLabel htmlFor={"username"}>Username</InputLabel>
        <Input
          id={"login--form-username"}
          onChange={this.setUsername}
          placeholder={"Your username"}
          value={username.value}
        />
        {!username.value && !username.pristine && (
          <FormHelperText id={"username-error"}>
            {username.helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  renderPasswordField = () => {
    const { form: { password } } = this.state;
    return (
      <FormControl
        error={!password.value && !password.pristine}
        fullWidth={true}
        required={password.required}
        style={{ marginTop: '8px' }}
      >
        <InputLabel htmlFor={"password"}>Password</InputLabel>
        <Input
          id={"login--form-password"}
          onChange={this.setPassword}
          placeholder={"Your strong password"}
          type={"password"}
          value={password.value}
        />
        {!password.value && !password.pristine && (
          <FormHelperText id={"password-error"}>
            {password.helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  render() {
    const { visibility, onCancel, error } = this.props;
    const { form: { username, password } } = this.state;
    return (
      <Dialog
        fullWidth={true}
        id={"login--form-container"}
        maxWidth={"xs"}
        onClose={onCancel}
        open={visibility}
        >
        <form noValidate={true} onSubmit={this.validateCredentials}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            {this.renderLoginError(error)}
            {this.renderNameField()}
            {this.renderPasswordField()}
          </DialogContent>
          <DialogActions className={"dialog-footer"}>
            <Button
              color={"inherit"}
              id={"login--form-cancel"}
              onClick={onCancel}
              type={"button"}
            >
              Cancel
            </Button>
            <Button
              color={"inherit"}
              disabled={!password.value || !username.value}
              id={"login--form-submit"}
              type={"submit"}
            >
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
