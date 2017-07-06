import React from 'react';
import {Button, Dialog, Input, MessageBox} from 'element-react';
import styled from 'styled-components';
import API from '../../../utils/API';
import storage from '../../../utils/storage';
import _ from 'lodash';

import classes from './header.scss';

import logo from './logo.png';

const SetupGuide = styled.figure`
  margin: 0 0 0 10px;
  font-size: 14px;
  line-height: 18px;
  padding: 8px 0;
  color: #f9f2f4;
`

export default class Header extends React.Component {
  state = {
    showLogin: false,
    username: '',
    password: ''
  }

  constructor (props) {
    super(props);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleLoginModal () {
    this.setState({
      showLogin: !this.state.showLogin
    })
  }

  handleInput (name, e) {
    this.setState({
      [name]: e
    })
  }

  async handleSubmit () {
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
      if (_.get(e, 'response.status', 0) === 401) {
        MessageBox.alert(e.response.data.error);
      } else {
        MessageBox.alert('Unable to login:' + e.message);
      }
    }
  }

  handleLogout () {
    storage.clear();
    location.reload();
  }

  renderUserActionButton () {
    if (storage.getItem('username')) { // TODO: Check jwt token expire
      return (
        <div className={classes.welcome}>
          Hi, {storage.getItem('username')}
          &nbsp;
          <Button type="danger" onClick={this.handleLogout}>Logout</Button>
        </div>
      )
    } else {
      return <Button type="danger" style={ {marginLeft: 'auto'} } onClick={ this.toggleLoginModal }>Login</Button>
    }
  }

  render() {
    return (
      <header className={ classes.header }>
        <div className={ classes.headerWrap }>
          <img src={ logo } className={ classes.logo } />
          <SetupGuide>
            npm set registry { location.origin }
            <br/>
            npm login
          </SetupGuide>
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
