/**
 * @prettier
 * @flow
 */

export interface IProps {
  history?: any;
}

export interface IState {
  search: string;
  suggestions: any[];
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

export type cancelAllSearchRequests = () => void;
export type handlePackagesClearRequested = () => void;
export type handleSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { newValue: string, method: string }) => void;
export type handleClickSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { suggestionValue: Array<Object>, method: string }) => void;
export type handleFetchPackages = ({ value: string }) => Promise<void>;
export type onBlur = (event: SyntheticKeyboardEvent<HTMLInputElement>) => void;
