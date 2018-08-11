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

  submitCredentials(event) {
    // prevents default submit behaviour
    event.preventDefault();
    const {username, password} = this.state;
    this.props.onSubmit(username, password);
    this.setState({username: '', password: ''});
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
              {error.type && (
                <Alert
                  title={error.title}
                  type={error.type}
                  description={error.description}
                  showIcon={true}
                  closable={false}
                />
              )}
              <br />
              <Input
                type="text"
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
