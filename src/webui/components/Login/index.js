import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button, Dialog, Input, Alert} from 'element-react';

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

  state = {
    username: '',
    password: ''
  }

  constructor(props) {
    super(props);
    this.submitCredentials = this.submitCredentials.bind(this);
    this.setCredentials = this.setCredentials.bind(this);
  }

  /**
   * set login modal's username and password to current state
   * Required by: <LoginModal />
   */
  setCredentials(name, e) {
    this.setState({
      [name]: e
    });
  }

  async submitCredentials(event) {
    // prevents default submit behaviour
    event.preventDefault();
    const {username, password} = this.state;
    await this.props.onSubmit(username, password);
    // let's wait for API response and then set
    // username and password filed to empty state
    this.setState({username: '', password: ''});
  }

  renderLoginError({type, title, description} = {}) {
    return type ? (
      <Alert
        title={title}
        type={type}
        description={description}
        showIcon={true}
        closable={false}
      />
    ) : '';
  }

  render() {
    const {visibility, onCancel, error} = this.props;
    const {username, password} = this.state;
    return (
      <div className="login-dialog">
        <Dialog
          title="Login"
          size="tiny"
          visible={visibility}
          onCancel={onCancel}
        >
          <Form className="login-form">
            <Dialog.Body>
              {this.renderLoginError(error)}
              <br />
              <Input
                name="username"
                placeholder="Username"
                value={username}
                onChange={this.setCredentials.bind(this, 'username')}
              />
              <br />
              <br />
              <Input
                name="password"
                type="password"
                placeholder="Type your password"
                value={password}
                onChange={this.setCredentials.bind(this, 'password')}
              />
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
              <Button onClick={onCancel} className="cancel-login-button">
                Cancel
              </Button>
              <Button
                nativeType="submit"
                className="login-button"
                onClick={this.submitCredentials}
              >
                Login
            </Button>
            </Dialog.Footer>
          </Form>
        </Dialog>
      </div>
    );
  }
}
