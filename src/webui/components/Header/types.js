/**
 * @prettier
 * @flow
 */

export interface IProps {
  username?: string;
  onLogout?: Function;
  toggleLoginModal: Function;
  scope: string;
  withoutSearch?: boolean;
}

export interface IState {
  anchorEl?: any;
  openInfoDialog: boolean;
  registryUrl: string;
  showMobileNavBar: boolean;
}
