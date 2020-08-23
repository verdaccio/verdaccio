import { Callback, Config, IPackageStorage, IPluginStorage, LocalStorage, Logger, Token, TokenFilter } from '@verdaccio/types';
/**
 * Handle local database.
 */
declare class LocalDatabase implements IPluginStorage<{}> {
    path: string;
    logger: Logger;
    data: LocalStorage;
    config: Config;
    locked: boolean;
    tokenDb: any;
    /**
     * Load an parse the local json database.
     * @param {*} path the database path
     */
    constructor(config: Config, logger: Logger);
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<Error | null>;
    /**
     * Add a new element.
     * @param {*} name
     * @return {Error|*}
     */
    add(name: string, cb: Callback): void;
    search(onPackage: Callback, onEnd: Callback, validateName: (name: string) => boolean): void;
    /**
     * Remove an element from the database.
     * @param {*} name
     * @return {Error|*}
     */
    remove(name: string, cb: Callback): void;
    /**
     * Return all database elements.
     * @return {Array}
     */
    get(cb: Callback): void;
    getPackageStorage(packageName: string): IPackageStorage;
    clean(): void;
    saveToken(token: Token): Promise<void>;
    deleteToken(user: string, tokenKey: string): Promise<void>;
    readTokens(filter: TokenFilter): Promise<Token[]>;
    private _getTime;
    private _getCustomPackageLocalStorages;
    /**
     * Syncronize {create} database whether does not exist.
     * @return {Error|*}
     */
    private _sync;
    /**
     * Verify the right local storage location.
     * @param {String} path
     * @return {String}
     * @private
     */
    private _getLocalStoragePath;
    /**
     * Build the local database path.
     * @param {Object} config
     * @return {string|String|*}
     * @private
     */
    private _buildStoragePath;
    private _dbGenPath;
    /**
     * Fetch local packages.
     * @private
     * @return {Object}
     */
    private _fetchLocalPackages;
    private getTokenDb;
    private _getTokenKey;
    private _compoundTokenKey;
}
export default LocalDatabase;
