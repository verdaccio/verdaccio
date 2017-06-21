import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconPerson from 'material-ui/svg-icons/social/person';
import Lock from 'material-ui/svg-icons/action/lock';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';

import {HeaderNav,
        MenuGroup,
        MenuItem,
        Code,
        CodeGroup,
        LogoImage,
        LogoItem, Navigation} from '../styled';

let logo = '/header.png';
if (process.env.BROWSER) {
  logo = require('./header.png');
}

const styles = {
  flex: {
    display: 'flex',
  },
  red: {
    backgroundColor: '#cc3d33',
  },
  fullWidth: {
    width: '100%',
  },
  spaceItems: {
    marginRight: 20,
  },
};

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  handleLogIn() {
    this.refs.form.submit();
  }

  render() {
    const standardActions = process.env.BROWSER ? [
      <RaisedButton key="Close"
                    label="Close"
                    style={styles.spaceItems}
                    onTouchTap={this.handleRequestClose}
      />,
      <RaisedButton
        key="LogIn"
        label="Log In"
        primary={true}
        backgroundColor={styles.red.backgroundColor}
        onTouchTap={this.handleLogIn}
      />,
    ] : [];
    return (
      <HeaderNav className="navbar">
        <Navigation className="wrapper">
          <MenuGroup>
            <LogoItem style={{'flex': '2 0 0'}}>
              <LogoImage src={`/-/static${logo}`}/>
            </LogoItem>
            <MenuItem style={{'flex': '10 0 0'}}>
              <CodeGroup>
                <div>
                  <Code>
                    { `npm set registry ${this.props.baseUrl}` }
                  </Code>
                </div>
                <div>
                  <Code>
                    { `npm adduser --registry ${this.props.baseUrl}` }
                  </Code>
                </div>
              </CodeGroup>
            </MenuItem>
            <MenuItem style={{'flex': '1 0 0'}}>
              <Dialog
                open={this.state.open}
                title="Welcome Back"
                actions={standardActions}
                onRequestClose={this.handleRequestClose}>
                <form method="POST" ref="form" action="/-/login" autoComplete={false}>
                  <List>
                    <ListItem disabled leftIcon={<IconPerson />}>
                      <TextField
                        name="user"
                        hintText="Username"
                        fullWidth={true}
                      />
                    </ListItem>
                    <ListItem disabled leftIcon={<Lock />}>
                      <TextField
                        name="pass"
                        hintText="Password"
                        fullWidth={true}
                        type="password"
                      />
                    </ListItem>
                  </List>
                </form>
              </Dialog>
              <RaisedButton
                label="Login"
                onTouchTap={this.handleTouchTap}
              />
            </MenuItem>
          </MenuGroup>
        </Navigation>
      </HeaderNav>
    );
  }
}

Header.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};


export default Header;
