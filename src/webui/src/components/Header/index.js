import React from 'react';
import {Form, Button, Dialog, Input, Alert} from 'element-react';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import {Link} from 'react-router-dom';

import API from '../../../utils/api';
import storage from '../../../utils/storage';
import {getRegistryURL} from '../../../utils/url';
import {HEADERS} from '../../../../lib/constants';

import classes from './header.scss';
import './logo.png';


export default class Header extends React.Component {
  state = {
    showLogin: false,
    username: '',
    password: '',
    logo: '',
    loginError: null
  }

  constructor(props) {
    super(props);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  toggleLoginModal() {
    this.setState({
      showLogin: !this.state.showLogin
    });
    this.setState({loginError: null});
  }

  handleInput(name, e) {
    this.setState({
      [name]: e
    });
  }

  componentWillMount() {
    API.request('logo')
    .then((logo) => this.setState({logo}))
    .catch((error) => {
      throw new Error(error);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      return this.setState({loginError: {
        title: 'Unable to login',
        type: 'error',
        description: 'Username or password can\'t be empty!'
      }});
    }

    try {
      const credentials = {
        username: this.state.username,
        password: this.state.password
      };
      const resp = await API.request(`login`, 'POST', {
        body: JSON.stringify(credentials),
        headers: {
          Accept: HEADERS.JSON,
          'Content-Type': HEADERS.JSON
        }
      });

      storage.setItem('token', resp.token);
      storage.setItem('username', resp.username);
      location.reload();
    } catch (e) {
      const errorObj = {
        title: 'Unable to login',
        type: 'error',
        description: e.error
      };
      this.setState({loginError: errorObj});
    }
  }

  get isTokenExpire() {
    const token = storage.getItem('token');

    if (!isString(token)) {
      return true;
    }

    let payload = token.split('.')[1];

    if (!payload) {
      return true;
    }

    try {
      payload = JSON.parse(atob(payload));
    } catch (err) {
      console.error('Invalid token:', err, token); // eslint-disable-line
      return false;
    }

    if (!payload.exp || !isNumber(payload.exp)) {
      return true;
    }

    const jsTimestamp = (payload.exp * 1000) - 30000; // Report as expire before (real expire time - 30s)
    const expired = Date.now() >= jsTimestamp;

    if (expired) {
      storage.clear();
    }

    return expired;
  }

  handleLogout() {
    storage.clear();
    location.reload();
  }

  renderUserActionButton() {
    if (!this.isTokenExpire) { // TODO: Check jwt token expire
      return (
        <div className="user-logged">
          <span className="user-logged-greetings" style={ {marginRight: '10px'} }>Hi, {storage.getItem('username')}</span>
          <Button className={`${classes.headerButton} header-button-logout`} type="danger" onClick={this.handleLogout}>Logout</Button>
        </div>
      );
    } else {
      return <Button className={`${classes.headerButton} header-button-login`} onClick={ this.toggleLoginModal }>Login</Button>;
    }
  }

  render() {
    const registryURL = getRegistryURL();

    return (
      <header className={ classes.header }>
        <div className={ classes.headerWrap }>
          <Link to="/">
            <img src={ this.state.logo } className={ classes.logo } />
          </Link>
          <figure>
            npm set registry { registryURL }
            <br/>
            npm adduser --registry { registryURL }
          </figure>

          <div className={ classes.headerRight }>
            {this.renderUserActionButton()}
          </div>
        </div>

        <Dialog
          title="Login"
          size="tiny"
          visible={ this.state.showLogin }
          onCancel={ () => this.toggleLoginModal() }
        >
          <Form className="login-form">
            <Dialog.Body>
              { this.state.loginError &&
              <Alert
                title={this.state.loginError.title} type={this.state.loginError.type}
                description={this.state.loginError.description} showIcon={true} closable={false}>
              </Alert>
              }
              <br/>
              <Input name="username" placeholder="Username" onChange={this.handleInput.bind(this, 'username')} />
              <br/><br/>
              <Input name="password" type="password" placeholder="Type your password" onChange={this.handleInput.bind(this, 'password')} />
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
              <Button onClick={ () => this.toggleLoginModal() } className="cancel-login-button">
                Cancel
              </Button>
              <Button nativeType="submit" className="login-button" onClick={ this.handleSubmit }>
                Login
              </Button>
            </Dialog.Footer>
          </Form>
        </Dialog>
      </header>
    );
  }
}
