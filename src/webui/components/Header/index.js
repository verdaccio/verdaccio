/**
 * @prettier
 */

// @flow

import React, {Component, MouseEvent} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Info from '@material-ui/icons/Info';
import Help from '@material-ui/icons/Help';
import FileCopy from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';

import {getRegistryURL} from '../../utils/url';
import {copyToClipBoard} from '../../utils/styles/mixins';
import Link from '../Link';
import Logo from '../Logo';

import InfoDialog from './infoDialog';
import {IProps, IState} from './interfaces';
import {Wrapper, InnerWrapper, ClipBoardCopy, ClipBoardCopyText, CopyIcon} from './styles';

class Header extends Component<IProps, IState> {
  constructor() {
    super();
    this.handleMenu = this.handleMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenInfoDialog = this.handleOpenInfoDialog.bind(this);
    this.handleCloseInfoDialog = this.handleCloseInfoDialog.bind(this);
    this.handleToggleLogin = this.handleToggleLogin.bind(this);
    this.renderInfoDialog = this.renderInfoDialog.bind(this);
    this.state = {
      anchorEl: null,
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

  handleMenu(event: MouseEvent<HTMLElement>) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }

  handleOpenInfoDialog() {
    this.setState({
      openInfoDialog: true,
    });
  }

  handleCloseInfoDialog() {
    this.setState({
      openInfoDialog: false,
    });
  }

  handleToggleLogin() {
    const {toggleLoginModal} = this.props;
    this.setState(
      {
        anchorEl: null,
      },
      () => toggleLoginModal()
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
    return (
      <div>
        <IconButton color="inherit" component={Link} to="https://verdaccio.org/docs/en/installation" blank>
          <Help />
        </IconButton>
        <IconButton color="inherit" onClick={this.handleOpenInfoDialog}>
          <Info />
        </IconButton>
        {username ? (
          this.renderMenu()
        ) : (
          <Button color="inherit" onClick={this.handleToggleLogin}>
            Login
          </Button>
        )}
      </div>
    );
  }

  renderMenu() {
    const {username = '', handleLogout} = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <IconButton aria-owns={username ? 'sidebar-menu' : null} aria-haspopup="true" color="inherit" onClick={this.handleMenu}>
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
          onClose={this.handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }

  renderCopyToClibBoard(text: string) {
    return (
      <ClipBoardCopy>
        <ClipBoardCopyText>{text}</ClipBoardCopyText>
        <Tooltip title="Copy to Clipboard">
          <CopyIcon aria-label="Copy to Clipboard" onClick={copyToClipBoard(text)}>
            <FileCopy />
          </CopyIcon>
        </Tooltip>
      </ClipBoardCopy>
    );
  }

  renderInfoDialog() {
    const {scope} = this.props;
    const {openInfoDialog, registryUrl} = this.state;
    return (
      <InfoDialog open={openInfoDialog} onClose={this.handleCloseInfoDialog}>
        {this.renderCopyToClibBoard(`npm set ${scope} registry ${registryUrl}`)}
        {this.renderCopyToClibBoard(`npm adduser --registry ${registryUrl}`)}
      </InfoDialog>
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
