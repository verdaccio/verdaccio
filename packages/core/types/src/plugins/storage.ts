import { Callback, CallbackAction } from '@verdaccio/types/src/commons';
import { Manifest, Token } from '@verdaccio/types/src/manifest';

export type StorageList = string[];

export interface ILocalStorage {
  add(name: string): void;
  remove(name: string): void;
  get(): StorageList;
  sync(): void;
}

export interface TokenFilter {
  user: string;
}

export interface ITokenActions {
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
}

/**
 * This method expect return a Package object
 * eg:
 * \{
 *   name: string;
 *   time: number;
 *   ... and other props
 * \}
 *
 * The `cb` callback object will be executed if:
 *  - it might return object (truly)
 *  - it might reutrn null
 */
export type onSearchPackage = (item: Manifest, cb: CallbackAction) => void;
// FIXME: error should be export type `VerdaccioError = HttpError & { code: number };`
// but this type is on @verdaccio/commons-api and cannot be used here yet
export type onEndSearchPackage = (error?: any) => void;
export type onValidatePackage = (name: string) => boolean;

export type StorageUpdateCallback = (data: Manifest, cb: CallbackAction) => void;

export type StorageWriteCallback = (name: string, json: Manifest, callback: Callback) => void;
export type PackageTransformer = (pkg: Manifest) => Manifest;
export type ReadPackageCallback = (err: any | null, data?: Manifest) => void;
