/**
 * @prettier
 * @flow
 */

import React, {Component} from 'react';
import Button from '@material-ui/core/Button/index';
import IconButton from '@material-ui/core/IconButton/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import Menu from '@material-ui/core/Menu/index';
import Info from '@material-ui/icons/Info';
import Help from '@material-ui/icons/Help';

import {getRegistryURL} from '../../utils/url';
import Link from '../Link';
import Logo from '../Logo';
import CopyToClipBoard from '../CopyToClipBoard/index';

import RegistryInfoDialog from '../RegistryInfoDialog';
import {IProps, IState} from './interfaces';
import {Wrapper, InnerWrapper} from './styles';

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

  renderLeftSide() {
    return (
      <Link to="/">
        <Logo />
      </Link>
    );
  }

  renderRightSide() {
    const {username = ''} = this.props;
    const installationLink = 'https://verdaccio.org/docs/en/installation';
    return (
      <div>
        <IconButton color="inherit" component={Link} to={installationLink} blank>
          <Help />
        </IconButton>
        <IconButton color="inherit" onClick={this.handleOpenRegistryInfoDialog}>
          <Info />
        </IconButton>
        {username ? (
          this.renderMenu(username)
        ) : (
          <Button color="inherit" onClick={this.handleToggleLogin}>
            Login
          </Button>
        )}
      </div>
    );
  }

  /**
   * render popover menu
   */
  renderMenu(username: string) {
    const {handleLogout} = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <Button color="inherit" aria-owns="sidebar-menu" aria-haspopup="true" onClick={this.handleLoggedInMenu}>
          Hi, {username}
        </Button>
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
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }

  renderInfoDialog() {
    const {scope} = this.props;
    const {openInfoDialog, registryUrl} = this.state;
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
