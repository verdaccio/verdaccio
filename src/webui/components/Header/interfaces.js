/**
 * @prettier
 * @flow
 */

export interface IProps {
  username?: string;
  onLogout?: Function;
  toggleLoginModal: Function;
  scope: string;
  search?: string;
  packages?: any[];
  withoutSearch?: boolean;
  onSearch?: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void;
}

export interface IState {
  anchorEl?: any;
  openInfoDialog: boolean;
  registryUrl: string;
  packages: any[];
  showMobileNavBar: boolean;
}
