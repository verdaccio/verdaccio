/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import Button from '@material-ui/core/Button/index';
import IconButton from '@material-ui/core/IconButton/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import Menu from '@material-ui/core/Menu/index';
import Info from '@material-ui/icons/Info';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip/index';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { getRegistryURL } from '../../utils/url';
import Link from '../Link';
import Logo from '../Logo';
import Label from '../Label';
import CopyToClipBoard from '../CopyToClipBoard/index';
import RegistryInfoDialog from '../RegistryInfoDialog';

import type { Node } from 'react';
import { IProps, IState } from './interfaces';
import { Wrapper, InnerWrapper, Greetings } from './styles';

class Header extends Component<IProps, IState> {
  handleLoggedInMenu: Function;
  handleLoggedInMenuClose: Function;
  handleOpenRegistryInfoDialog: Function;
  handleCloseRegistryInfoDialog: Function;
  handleToggleLogin: Function;
  renderInfoDialog: Function;

  constructor(props: Object) {
    super(props);
    this.handleLoggedInMenu = this.handleLoggedInMenu.bind(this);
    this.handleLoggedInMenuClose = this.handleLoggedInMenuClose.bind(this);
    this.handleOpenRegistryInfoDialog = this.handleOpenRegistryInfoDialog.bind(this);
    this.handleCloseRegistryInfoDialog = this.handleCloseRegistryInfoDialog.bind(this);
    this.handleToggleLogin = this.handleToggleLogin.bind(this);
    this.renderInfoDialog = this.renderInfoDialog.bind(this);
    this.state = {
      openInfoDialog: false,
      registryUrl: '',
    };
  }

  componentDidMount() {
    const registryUrl = getRegistryURL();
    this.setState({
      registryUrl,
    });
  }

  /**
   * opens popover menu for logged in user.
   */
  handleLoggedInMenu(event: SyntheticEvent<HTMLElement>) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  /**
   * closes popover menu for logged in user
   */
  handleLoggedInMenuClose() {
    this.setState({
      anchorEl: null,
    });
  }

  /**
   * opens registry information dialog.
   */
  handleOpenRegistryInfoDialog() {
    this.setState({
      openInfoDialog: true,
    });
  }

  /**
   * closes registry information dialog.
   */
  handleCloseRegistryInfoDialog() {
    this.setState({
      openInfoDialog: false,
    });
  }

  /**
   * close/open popover menu for logged in users.
   */
  handleToggleLogin() {
    this.setState(
      {
        anchorEl: null,
      },
      this.props.toggleLoginModal
    );
  }

  renderLeftSide(): Node {
    return (
      <a href="{registryUrl}/#/">
        <Logo />
      </a>
    );
  }

  renderRightSide(): Node {
    const { username = '' } = this.props;
    const installationLink = 'https://verdaccio.org/docs/en/installation';
    return (
      <div>
        <Tooltip title="Documentation" disableFocusListener>
          <IconButton color="inherit" component={Link} to={installationLink} blank>
            <Help />
          </IconButton>
        </Tooltip>
        <Tooltip title="Registry Information" disableFocusListener>
          <IconButton id="header--button-registryInfo" color="inherit" onClick={this.handleOpenRegistryInfoDialog}>
            <Info />
          </IconButton>
        </Tooltip>
        {username ? (
          this.renderMenu()
        ) : (
          <Button id="header--button-login" color="inherit" onClick={this.handleToggleLogin}>
            Login
          </Button>
        )}
      </div>
    );
  }

  /**
   * render popover menu
   */
  renderMenu(): Node {
    const { handleLogout, username = '' } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <IconButton id="header--button-account" aria-owns="sidebar-menu" aria-haspopup="true" color="inherit" onClick={this.handleLoggedInMenu}>
          <AccountCircle />
        </IconButton>
        <Menu
          id="sidebar-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleLoggedInMenuClose}
        >
          <MenuItem disabled>
            <Greetings>{`Hi,`}</Greetings>
            <Label text={username} limit={140} weight="bold" capitalize />
          </MenuItem>
          <MenuItem onClick={handleLogout} id="header--button-logout">
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }

  renderInfoDialog(): Node {
    const { scope } = this.props;
    const { openInfoDialog, registryUrl } = this.state;
    return (
      <RegistryInfoDialog open={openInfoDialog} onClose={this.handleCloseRegistryInfoDialog}>
        <div>
          <CopyToClipBoard text={`npm set ${scope} registry ${registryUrl}`} />
          <CopyToClipBoard text={`npm adduser --registry ${registryUrl}`} />
        </div>
      </RegistryInfoDialog>
    );
  }

  render() {
    return (
      <Wrapper position="static">
        <InnerWrapper>
          {this.renderLeftSide()}
          {this.renderRightSide()}
        </InnerWrapper>
        {this.renderInfoDialog()}
      </Wrapper>
    );
  }
}

export default Header;
