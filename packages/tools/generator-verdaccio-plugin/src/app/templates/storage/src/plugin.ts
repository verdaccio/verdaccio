import { getInternalError } from '@verdaccio/commons-api';
import {
  Callback,
  Config,
  IPackageStorage,
  IPluginStorage,
  Logger,
  PluginOptions,
  Token,
  TokenFilter,
  onEndSearchPackage,
  onSearchPackage,
  onValidatePackage,
} from '@verdaccio/types';

import { CustomConfig } from '../types/index';
import PackageStorage from './PackageStorage';

export default class VerdaccioStoragePlugin implements IPluginStorage<CustomConfig> {
  config: CustomConfig & Config;
  version?: string;
  public logger: Logger;
  public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
    this.config = config;
    this.logger = options.logger;
  }

  /**
   *
   */
  public async getSecret(): Promise<string> {
    /**
     * return await resolveSecret();
     */
  }

  public async setSecret(secret: string): Promise<any> {
    /**
     * return await getYourSecret();
     */
  }

  /**
   * Add a new element.
   * @param {*} name
   * @return {Error|*}
   */
  public add(name: string, callback: Callback): void {}

  /**
   * Perform a search in your registry
   * @param onPackage
   * @param onEnd
   * @param validateName
   */
  public search(
    onPackage: onSearchPackage,
    onEnd: onEndSearchPackage,
    validateName: onValidatePackage
  ): void {
    /**
     * Example of implementation:
     * try {
     *  someApi.getPackages((items) => {
     *   items.map(() => {
     *     if (validateName(item.name)) {
     *       onPackage(item);
     *     }
     *   });
     *  onEnd();
     * } catch(err) {
     *   onEnd(err);
     * }
     * });
     */
  }

  /**
   * Remove an element from the database.
   * @param {*} name
   * @return {Error|*}
   */
  public remove(name: string, callback: Callback): void {
    /**
     * Example of implementation
      database.getPackage(name, (item, err) => {
        if (err) {
          callback(getInternalError('your own message here'));
        }

        // if all goes well we return nothing
        callback(null);
      }
    */
  }

  /**
   * Return all database elements.
   * @return {Array}
   */
  public get(callback: Callback): void {
    /*
      Example of implementation
      database.getAll((allItems, err) => {
        callback(err, allItems);
      })
    */
  }

  /**
   * Create an instance of the `PackageStorage`
   * @param packageInfo
   */
  public getPackageStorage(packageInfo: string): IPackageStorage {
    return new PackageStorage(this.config, packageInfo, this.logger);
  }

  /**
   * All methods for npm token support
   * more info here https://github.com/verdaccio/verdaccio/pull/1427
   */

  public saveToken(token: Token): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public deleteToken(user: string, tokenKey: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    throw new Error('Method not implemented.');
  }
}
