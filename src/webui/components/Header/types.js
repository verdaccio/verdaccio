/**
 * @prettier
 * @flow
 */

export interface IProps {
  username?: string;
  onLogout?: Function;
  onToggleLoginModal: Function;
  scope: string;
  withoutSearch?: boolean;
}

export interface IState {
  anchorEl?: any;
  openInfoDialog: boolean;
  registryUrl: string;
  showMobileNavBar: boolean;
}

export type ToolTipType = 'search' | 'help' | 'info';
