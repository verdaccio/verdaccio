import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

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
    onCancel: () => { },
    onSubmit: () => { }
  }

  state = {
    form: {
      username: '',
      password: ''
    },
    rules: {
      username: [
        {
          required: true,
          message: 'Please input the username',
          trigger: 'change'
        }
      ],
      password: [
        {
          required: true,
          message: 'Please input the password',
          trigger: 'change'
        }
      ]
    }
  };

  constructor(props) {
    super(props);
    this.formRef = createRef();
    this.submitCredentials = this.submitCredentials.bind(this);
    this.setCredentials = this.setCredentials.bind(this);
  }

  /**
   * set login modal's username and password to current state
   * Required to login
   */
  setCredentials(name, e) {
    this.setState({
      [name]: e.target.value
    });
  }

  /**
   * Clears the username and password field.
   */
  handleReset() {
    this.formRef.current.resetFields();
  }

  submitCredentials(event) {
    // prevents default submit behavior
    event.preventDefault();

    const { username, password } = this.state;
    await this.props.onSubmit(username, password);
    // let's wait for API response and then set
    // username and password filed to empty state
    this.setState({ username: '', password: '' });
  }

  renderLoginError({ type, title, description } = {}) {
    return type === 'error' && (
      <SnackbarContent
        className={classes.loginError}
        aria-describedby="client-snackbar"
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
    const { username, password } = this.state;
    return (
      <div className="login">
        <Dialog
          onClose={onCancel}
          open={visibility}
          maxWidth="xs"
          aria-labelledby="login-dialog"
          fullWidth
        >
          <DialogTitle id="login-dialog">Login</DialogTitle>
          <DialogContent>
            {this.renderLoginError(error)}
            <TextField
              label="Username"
              placeholder="Please type your username"
              defaultValue={username}
              onChange={this.setCredentials.bind(this, 'username')}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              placeholder="Please type your password"
              defaultValue={password}
              onChange={this.setCredentials.bind(this, 'password')}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions className="dialog-footer">
            <Button
              onClick={onCancel}
              className="cancel-login-button"
              color="inherit"
            >
              Cancel
              </Button>
            <Button
              className="login-button"
              onClick={this.submitCredentials.bind(this)}
              color="inherit"
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
}
