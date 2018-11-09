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
import InputAdornment from '@material-ui/core/InputAdornment';
import { default as IconSearch } from '@material-ui/icons/Search';

import { getRegistryURL } from '../../utils/url';
import Link from '../Link';
import Logo from '../Logo';
import CopyToClipBoard from '../CopyToClipBoard/index';
import RegistryInfoDialog from '../RegistryInfoDialog';
import AutoComplete from '../AutoComplete';
import Label from '../Label';

import type { Node } from 'react';
import { IProps, IState } from './types';
import colors from '../../utils/styles/colors';
import { Greetings, NavBar, InnerNavBar, MobileNavBar, InnerMobileNavBar, LeftSide, RightSide, Search, IconSearchButton } from './styles';

class Header extends Component<IProps, IState> {
  handleLoggedInMenu: Function;
  handleLoggedInMenuClose: Function;
  handleOpenRegistryInfoDialog: Function;
  handleCloseRegistryInfoDialog: Function;
  handleToggleLogin: Function;
  renderInfoDialog: Function;

  constructor(props: IProps) {
    super(props);
    const { packages = [] } = props;
    this.state = {
      openInfoDialog: false,
      registryUrl: '',
      packages,
      showMobileNavBar: false,
    };
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (nextProps.packages !== prevState.packages) {
      return {
        packages: nextProps.packages,
      };
    }

    return null;
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
  handleLoggedInMenu = (event: SyntheticEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  /**
   * closes popover menu for logged in user
   */
  handleLoggedInMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  /**
   * opens registry information dialog.
   */
  handleOpenRegistryInfoDialog = () => {
    this.setState({
      openInfoDialog: true,
    });
  };

  /**
   * closes registry information dialog.
   */
  handleCloseRegistryInfoDialog = () => {
    this.setState({
      openInfoDialog: false,
    });
  };

  /**
   * close/open popover menu for logged in users.
   */
  handleToggleLogin = () => {
    this.setState(
      {
        anchorEl: null,
      },
      this.props.toggleLoginModal
    );
  };

  handleToggleMNav = () => {
    this.setState({
      showMobileNavBar: !this.state.showMobileNavBar,
    });
  };

  handleDismissMNav = () => {
    this.setState({
      showMobileNavBar: false,
    });
  };

  renderLeftSide = (): Node => {
    const { packages } = this.state;
    const { onSearch = () => {}, search = '', withoutSearch = false, ...others } = this.props;
    return (
      <LeftSide>
        <Link to="/" style={{ marginRight: '1em' }}>
          <Logo />
        </Link>
        {!withoutSearch && (
          <Search>
            <AutoComplete
              suggestions={packages}
              onChange={onSearch}
              value={search}
              placeholder="Search packages"
              color={colors.white}
              startAdornment={
                <InputAdornment position="start" style={{ color: colors.white }}>
                  <IconSearch />
                </InputAdornment>
              }
              {...others}
            />
          </Search>
        )}
      </LeftSide>
    );
  };

  renderRightSide = (): Node => {
    const { username = '', withoutSearch = false } = this.props;
    const installationLink = 'https://verdaccio.org/docs/en/installation';
    return (
      <RightSide>
        {!withoutSearch && (
          <Tooltip title="Search packages" disableFocusListener>
            <IconSearchButton color="inherit" onClick={this.handleToggleMNav}>
              <IconSearch />
            </IconSearchButton>
          </Tooltip>
        )}
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
      </RightSide>
    );
  };

  /**
   * render popover menu
   */
  renderMenu = (): Node => {
    const { onLogout, username = '' } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <IconButton id="header--button-account" color="inherit" onClick={this.handleLoggedInMenu}>
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
          <MenuItem onClick={onLogout} id="header--button-logout">
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  };

  renderInfoDialog = (): Node => {
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
  };

  render() {
    const { packages, showMobileNavBar } = this.state;
    const { onSearch = () => {}, search = '', withoutSearch = false, ...others } = this.props;
    return (
      <div>
        <NavBar position="static">
          <InnerNavBar>
            {this.renderLeftSide()}
            {this.renderRightSide()}
          </InnerNavBar>
          {this.renderInfoDialog()}
        </NavBar>
        {showMobileNavBar &&
          !withoutSearch && (
            <MobileNavBar>
              <InnerMobileNavBar>
                <AutoComplete suggestions={packages} onChange={onSearch} value={search} placeholder="Search packages" disableUnderline {...others} />
              </InnerMobileNavBar>
              <Button color="inherit" onClick={this.handleDismissMNav}>
                Cancel
              </Button>
            </MobileNavBar>
          )}
      </div>
    );
  }
}

export default Header;
