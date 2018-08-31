import React, {Component, createRef} from 'react';
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
  };

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
   * Required by: <LoginModal />
   */
  setCredentials(key, value) {
    this.setState(
      (prevState) => ({
        form: {...prevState.form, [key]: value}
      })
    );
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
    this.formRef.current.validate((valid) => {
      if (valid) {
        const {username, password} = this.state.form;
        this.props.onSubmit(username, password);
        this.setState({
          form: {username}
        });
      }
      return false;
    });
  }

  renderLoginError({type, title, description} = {}) {
    return type ? (
      <Alert
        title={title}
        type={type}
        description={description}
        showIcon={true}
        closable={false}
        style={{lineHeight: '10px'}}
      />
    ) : (
      ''
    );
  }

  render() {
    const {visibility, onCancel, error} = this.props;
    const {username, password} = this.state.form;
    return (
      <div className="login-dialog">
        <Dialog
          title="Login"
          size="tiny"
          visible={visibility}
          onCancel={onCancel}
        >
          <Dialog.Body>
            <Form
              className="login-form"
              ref={this.formRef}
              model={this.state.form}
              rules={this.state.rules}
            >
              <Form.Item>
                {this.renderLoginError(error)}
              </Form.Item>
              <Form.Item prop="username" labelPosition="top">
                <Input
                  name="username"
                  placeholder="Type your username"
                  value={username}
                  onChange={this.setCredentials.bind(this, 'username')}
                />
              </Form.Item>
              <Form.Item prop="password">
                <Input
                  name="password"
                  type="password"
                  placeholder="Type your password"
                  value={password}
                  onChange={this.setCredentials.bind(this, 'password')}
                />
              </Form.Item>
              <Form.Item style={{float: 'right'}}>
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
              </Form.Item>
            </Form>
          </Dialog.Body>
        </Dialog>
      </div>
    );
  }
}
