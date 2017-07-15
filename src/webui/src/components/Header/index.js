import React from 'react';
import {Button, Dialog, Input, MessageBox} from 'element-react';
import API from '../../../utils/api';
import storage from '../../../utils/storage';
import isString from 'lodash/isString';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import {Link} from 'react-router-dom';

import classes from './header.scss';
import logo from './logo.png';

export default class Header extends React.Component {
  state = {
    showLogin: false,
    username: '',
    password: ''
  }

  constructor(props) {
    super(props);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleLoginModal() {
    this.setState({
      showLogin: !this.state.showLogin
    });
  }

  handleInput(name, e) {
    this.setState({
      [name]: e
    });
  }

  async handleSubmit() {
    if (this.state.username === '' || this.state.password === '') {
      return MessageBox.alert('Username or password can\'t be empty!');
    }

    try {
      let resp = await API.post(`login`, {
        data: {
          username: this.state.username,
          password: this.state.password
        }
      });

      storage.setItem('token', resp.data.token);
      storage.setItem('username', resp.data.username);
      location.reload();
    } catch (e) {
      if (get(e, 'response.status', 0) === 401) {
        MessageBox.alert(e.response.data.error);
      } else {
        MessageBox.alert('Unable to login:' + e.message);
      }
    }
  }

  get isTokenExpire() {
    let token = storage.getItem('token');
    if (!isString(token)) return true;
    let payload = token.split('.')[1];
    if (!payload) return true;
    try {
      payload = JSON.parse(atob(payload));
    } catch (err) {
      console.error('Invalid token:', err, token); // eslint-disable-line
      return false;
    }
    if (!payload.exp || !isNumber(payload.exp)) return true;
    let jsTimestamp = (payload.exp * 1000) - 30000; // Report as expire before (real expire time - 30s)

    let expired = Date.now() >= jsTimestamp;
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
        <div className={ classes.welcome }>
          Hi, {storage.getItem('username')}
          &nbsp;
          <Button type="danger" onClick={this.handleLogout}>Logout</Button>
        </div>
      );
    } else {
      return <Button type="danger" style={ {marginLeft: 'auto'} } onClick={ this.toggleLoginModal }>Login</Button>;
    }
  }

  render() {
    return (
      <header className={ classes.header }>
        <div className={ classes.headerWrap }>
          <Link to="/">
            <img src={ logo } className={ classes.logo } />
          </Link>
          <figure>
            npm set registry { location.origin }
            <br/>
            npm login
          </figure>
          {this.renderUserActionButton()}
        </div>

        <Dialog
          title="Login"
          size="tiny"
          visible={ this.state.showLogin }
          onCancel={ () => this.toggleLoginModal() }
        >
          <Dialog.Body>
            <Input placeholder="Username" onChange={this.handleInput.bind(this, 'username')} />
            <br/><br/>
            <Input type="password" placeholder="Type your password" onChange={this.handleInput.bind(this, 'password')} />
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.toggleLoginModal() }>Cancel</Button>
            <Button type="primary" onClick={ this.handleSubmit }>Login</Button>
          </Dialog.Footer>
        </Dialog>
      </header>
    );
  }
}
