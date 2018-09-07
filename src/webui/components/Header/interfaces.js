/**
 * @prettier
 */

// @flow

export interface IProps {
  username?: string;
  handleLogout: () => {};
  toggleLoginModal: () => {};
  scope: string;
}

export interface IState {
  anchorEl?: HTMLElement;
  openInfoDialog: boolean;
  registryUrl: string;
}
