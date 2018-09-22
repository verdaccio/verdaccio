/**
 * @prettier
 */

// @flow

export interface IProps {
  username?: string;
  handleLogout: Function;
  toggleLoginModal: Function;
  scope: string;
}

export interface IState {
  anchorEl?: any;
  openInfoDialog: boolean;
  registryUrl: string;
}
