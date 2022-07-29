/// <reference types="node" />
import { PassThrough, PipelinePromise, Readable, Stream, Writable } from 'stream';

declare module '@verdaccio/types' {
  type StringValue = string | void | null;

  type StorageList = string[];
  type Callback = Function;
  // FIXME: err should be something flexible enough for any implementation
  type CallbackAction = (err: any | null) => void;
  interface Author {
    username?: string;
    name: string;
    email?: string;
    url?: string;
  }

  type PackageManagers = 'pnpm' | 'yarn' | 'npm';

  // FUTURE: WebConf and TemplateUIOptions should be merged .
  type CommonWebConf = {
    title?: string;
    logo?: string;
    favicon?: string;
    gravatar?: boolean;
    sort_packages?: string;
    darkMode?: boolean;
    url_prefix?: string;
    language?: string;
    login?: boolean;
    scope?: string;
    pkgManagers?: PackageManagers[];
  };

  /**
   * Options are passed to the index.html
   */
  export type TemplateUIOptions = {
    uri?: string;
    darkMode?: boolean;
    protocol?: string;
    host?: string;
    // deprecated
    basename?: string;
    scope?: string;
    showInfo?: boolean;
    showSettings?: boolean;
    showSearch?: boolean;
    showFooter?: boolean;
    showThemeSwitch?: boolean;
    showDownloadTarball?: boolean;
    showRaw?: boolean;
    base: string;
    primaryColor?: string;
    version?: string;
    logoURI?: string;
    flags: FlagsConfig;
  } & CommonWebConf;

  /**
   * Options on config.yaml for web
   */
  type WebConf = {
    // FIXME: rename to primaryColor and move it to CommonWebConf
    primary_color?: string;
    enable?: boolean;
    scriptsHead?: string[];
    scriptsBodyAfter?: string[];
    metaScripts?: string[];
    bodyBefore?: string[];
    bodyAfter?: string[];
  } & CommonWebConf;

  interface Signatures {
    keyid: string;
    sig: string;
  }

  interface Dist {
    'npm-signature'?: string;
    fileCount?: number;
    integrity?: string;
    shasum: string;
    unpackedSize?: number;
    tarball: string;
  }

  interface RemoteUser {
    real_groups: string[];
    groups: string[];
    name: string | void;
    error?: string;
  }

  interface LocalStorage {
    list: any;
    secret: string;
  }

  interface Version {
    name: string;
    version: string;
    devDependencies?: string;
    directories?: any;
    dist: Dist;
    author: string | Author;
    main: string;
    homemage?: string;
    license?: string;
    readme: string;
    readmeFileName?: string;
    readmeFilename?: string;
    description: string;
    bin?: string;
    bugs?: any;
    files?: string[];
    gitHead?: string;
    maintainers?: Author[];
    contributors?: Author[];
    repository?: string | any;
    scripts?: any;
    homepage?: string;
    etag?: string;
    dependencies: any;
    keywords?: string | string[];
    nodeVersion?: string;
    _id: string;
    _npmVersion?: string;
    _npmUser: Author;
    _hasShrinkwrap?: boolean;
    deprecated?: string;
  }

  interface Logger {
    child: (conf: any) => any;
    debug: (conf: any, template?: string) => void;
    error: (conf: any, template?: string) => void;
    http: (conf: any, template?: string) => void;
    trace: (conf: any, template?: string) => void;
    warn: (conf: any, template?: string) => void;
    info: (conf: any, template?: string) => void;
  }

  interface Versions {
    [key: string]: Version;
  }

  interface DistFile {
    url: string;
    sha: string;
    registry?: string;
  }

  interface MergeTags {
    [key: string]: string;
  }

  interface DistFiles {
    [key: string]: DistFile;
  }

  interface AttachMents {
    [key: string]: AttachMentsItem;
  }

  interface AttachMentsItem {
    data?: string;
    content_type?: string;
    length?: number;
    shasum?: string;
    version?: string;
  }

  interface GenericBody {
    [key: string]: string;
  }

  interface UpLinkMetadata {
    etag: string;
    fetched: number;
  }

  interface UpLinks {
    [key: string]: UpLinkMetadata;
  }

  interface Tags {
    [key: string]: Version;
  }

  interface Headers {
    [key: string]: string;
  }

  interface PackageUsers {
    [key: string]: boolean;
  }

  /**
   * @deprecated use Manifest instead
   */
  interface Package {
    _id?: string;
    name: string;
    versions: Versions;
    'dist-tags': GenericBody;
    time: GenericBody;
    readme?: string;
    users?: PackageUsers;
    _distfiles: DistFiles;
    _attachments: AttachMents;
    _uplinks: UpLinks;
    _rev: string;
  }

  interface PublishManifest {
    /**
     * The `_attachments` object has different usages:
     *
     * - When a package is published, it contains the tarball as an string, this string is used to be
     * converted as a tarball, usually attached to the package but not stored in the database.
     * - If user runs `npm star` the _attachments will be at the manifest body but empty.
     *
     * It has also an internal usage:
     *
     * - Used as a cache for the tarball, quick access to the tarball shasum, etc. Instead
     * iterate versions and find the right one, just using the tarball as a key which is what
     * the package manager sends to the registry.
     *
     * - A `_attachments` object is added every time a private tarball is published, upstream cached tarballs are
     * not being part of this object, only for published private packages.
     *
     * Note: This field is removed when the package is accesed through the web user interface.
     * */
    _attachments: AttachMents;
  }

  /**
   * Represents upstream manifest from another registry
   */
  interface FullRemoteManifest {
    _id?: string;
    _rev?: string;
    name: string;
    description?: string;
    'dist-tags': GenericBody;
    time: GenericBody;
    versions: Versions;
    maintainers?: Author[];
    /** store the latest readme **/
    readme?: string;
    /** store star assigned to this packages by users */
    users?: PackageUsers;
    // TODO: not clear what access exactly means
    access?: any;
    bugs?: { url: string };
    license?: string;
    homepage?: string;
    repository?: string | { type?: string; url: string; directory?: string };
    keywords?: string[];
  }

  interface Manifest extends FullRemoteManifest, PublishManifest {
    // private fields only used by verdaccio
    /**
     * store fast access to the dist url of an specific tarball, instead search version
     * by id, just the tarball id is faster.
     *
     * The _distfiles is created only when a package is being sync from an upstream.
     * also used to fetch tarballs from upstream, the private publish tarballs are not stored in
     * this object because they are not published in the upstream registry.
     */
    _distfiles: DistFiles;
    /**
     * Store access cache metadata, to avoid to fetch the same metadata multiple times.
     *
     * The key represents the uplink id which is composed of a etag and a fetched timestamp.
     *
     * The fetched timestamp is the time when the metadata was fetched, used to avoid to fetch the
     * same metadata until the metadata is older than the last fetch.
     */
    _uplinks: UpLinks;
    /**
     * store the revision of the manifest
     */
    _rev: string;
  }

  interface UpLinkTokenConf {
    type: 'Bearer' | 'Basic';
    token?: string;
    token_env?: boolean | string;
  }

  interface UpLinkConf {
    url: string;
    ca?: string;
    cache?: boolean;
    timeout?: string | void;
    maxage?: string | void;
    max_fails?: number | void;
    fail_timeout?: string | void;
    headers?: Headers;
    auth?: UpLinkTokenConf;
    strict_ssl?: boolean | void;
    _autogenerated?: boolean;
  }

  interface AuthPluginPackage {
    packageName: string;
    packageVersion?: string;
    tag?: string;
  }

  interface PackageAccess {
    storage?: string;
    publish?: string[];
    proxy?: string[];
    access?: string[];
    unpublish: string[];
  }

  interface PackageAccessYaml {
    storage?: string;
    publish?: string;
    proxy?: string;
    access?: string;
    unpublish?: string;
  }

  // info passed to the auth plugin when a package is package is being published
  interface AllowAccess {
    name: string;
    version?: string;
    tag?: string;
  }

  interface AuthPackageAllow extends PackageAccess, AllowAccess {}

  interface PackageList {
    [key: string]: PackageAccess;
  }

  interface PackageListYaml {
    [key: string]: PackageAccessYaml;
  }
  interface UpLinksConfList {
    [key: string]: UpLinkConf;
  }

  type LoggerType = 'stdout' | 'stderr' | 'file';
  type LoggerFormat = 'pretty' | 'pretty-timestamped' | 'file' | 'json';
  type LoggerLevel = 'http' | 'fatal' | 'warn' | 'info' | 'debug' | 'trace';

  interface LoggerConfItem {
    type: LoggerType;
    format: LoggerFormat;
    level: LoggerLevel;
  }

  interface PublishOptions {
    allow_offline: boolean;
  }

  type AuthConf = any | AuthHtpasswd;

  interface AuthHtpasswd {
    file: string;
    max_users: number;
  }

  // FUTURE: rename to Notification
  interface Notifications {
    method: string;
    packagePattern: RegExp;
    packagePatternFlags: string;
    endpoint: string;
    content: string;
    headers: Headers;
  }

  type Notification = Notifications;

  interface Token {
    user: string;
    token: string;
    key: string;
    cidr?: string[];
    readonly: boolean;
    created: number | string;
    updated?: number | string;
  }

  interface TokenFilter {
    user: string;
  }

  type IPackageStorage = ILocalPackageManager | undefined;
  type IPackageStorageManager = ILocalPackageManager;
  type IPluginStorage<T> = ILocalData<T>;

  interface AuthHtpasswd {
    file: string;
    max_users: number;
  }

  interface ILocalStorage {
    add(name: string): void;
    remove(name: string): void;
    get(): StorageList;
    sync(): void;
  }

  interface ListenAddress {
    [key: string]: string;
  }
  interface HttpsConfKeyCert {
    key: string;
    cert: string;
    ca?: string;
  }

  interface HttpsConfPfx {
    pfx: string;
    passphrase?: string;
  }

  type HttpsConf = HttpsConfKeyCert | HttpsConfPfx;

  interface JWTOptions {
    sign: JWTSignOptions;
    verify: JWTVerifyOptions;
  }

  interface JWTVerifyOptions {
    algorithm?: string;
    expiresIn?: string;
    notBefore?: string | number;
    ignoreExpiration?: boolean;
    maxAge?: string | number;
    clockTimestamp?: number;
  }

  interface JWTSignOptions {
    algorithm?: string;
    expiresIn?: string;
    notBefore?: string;
    ignoreExpiration?: boolean;
    maxAge?: string | number;
    clockTimestamp?: number;
  }

  interface APITokenOptions {
    legacy: boolean;
    jwt?: JWTOptions;
  }

  interface Security {
    web: JWTOptions;
    api: APITokenOptions;
  }

  export type FlagsConfig = {
    searchRemote?: boolean;
    changePassword?: boolean;
  };

  export type RateLimit = {
    windowMs: number;
    max: number;
  };

  export type ServerSettingsConf = {
    // express-rate-limit settings
    rateLimit: RateLimit;
    keepAliveTimeout?: number;
    // force http2 if https is defined
    http2?: boolean;
  };

  type URLPrefix = {
    // if is false, it would be relative by default
    absolute: boolean;
    // base path
    // eg: absolute: true, https://somedomain.com/xxx/
    // eg: absolute: false, /xxx/ (default) if url_prefix is an string instead an object
    basePath: string;
  };

  /**
   * YAML configuration file available options.
   */
  interface ConfigYaml {
    _debug?: boolean;
    storage?: string | void;
    packages?: PackageListYaml;
    uplinks: UpLinksConfList;
    // FUTURE: log should be mandatory
    log?: LoggerConfItem;
    web?: WebConf;
    auth?: AuthConf;
    security?: Security;
    publish?: PublishOptions;
    store?: any;
    listen?: ListenAddress;
    https?: HttpsConf;
    http_proxy?: string;
    plugins?: string | void;
    https_proxy?: string;
    no_proxy?: string;
    max_body_size?: string;
    notifications?: Notifications;
    notify?: Notifications | Notifications[];
    middlewares?: any;
    filters?: any;
    url_prefix?: string;
    server?: ServerSettingsConf;
    flags?: FlagsConfig;
    // internal objects, added by internal yaml to JS config parser
    // @deprecated use configPath instead
    config_path?: string;
    // save the configuration file path
    configPath?: string;
  }

  /**
   * Configuration object with additonal methods for configuration, includes yaml and internal medatada.
   * @interface Config
   * @extends {ConfigYaml}
   */
  interface Config extends Omit<ConfigYaml, 'packages' | 'security' | 'configPath'> {
    user_agent: string;
    server_id: string;
    secret: string;
    // save the configuration file path, it's fails without thi configPath
    configPath: string;
    // packages from yaml file looks different from packages inside the config file
    packages: PackageList;
    // security object defaults is added by the config file but optional in the yaml file
    security: Security;
    // @deprecated (pending adding the replacement)
    checkSecretKey(token: string): string;
    getMatchedPackagesSpec(storage: string): PackageAccess | void;
    // TODO: verify how to handle this in the future
    [key: string]: any;
  }

  type PublisherMaintainer = {
    username: string;
    email: string;
  };

  type SearchPackageBody = {
    name: string;
    scope: string;
    description: string;
    author: string | PublisherMaintainer;
    version: string;
    keywords: string | string[] | undefined;
    date: string;
    links?: {
      npm: string; // only include placeholder for URL eg: {url}/{packageName}
      homepage?: string;
      repository?: string;
      bugs?: string;
    };
    publisher?: any;
    maintainers?: PublisherMaintainer[];
  };

  interface ConfigWithHttps extends Config {
    https: HttpsConf;
  }

  export interface ITokenActions {
    saveToken(token: Token): Promise<any>;
    deleteToken(user: string, tokenKey: string): Promise<any>;
    readTokens(filter: TokenFilter): Promise<Token[]>;
  }

  /**
   * @deprecated use @verdaccio/core pluginUtils instead
   */
  interface ILocalData<T> extends IPlugin<T>, ITokenActions {
    logger: Logger;
    config: T & Config;
    add(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    get(): Promise<any>;
    init(): Promise<void>;
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<any>;
    getPackageStorage(packageInfo: string): IPackageStorage;
  }

  interface ILocalPackageManager {
    logger: Logger;
    deletePackage(fileName: string): Promise<void>;
    removePackage(): Promise<void>;
    //  next packages migration (this list is meant to replace the callback parent functions)
    updatePackage(
      packageName: string,
      handleUpdate: (manifest: Manifest) => Promise<Manifest>
    ): Promise<Manifest>;
    readPackage(name: string): Promise<Manifest>;
    savePackage(pkgName: string, value: Manifest): Promise<void>;
    readTarball(pkgName: string, { signal }): Promise<Readable>;
    createPackage(name: string, manifest: Manifest): Promise<void>;
    writeTarball(tarballName: string, { signal }): Promise<Writable>;
    // verify if tarball exist in the storage
    hasTarball(fileName: string): Promise<boolean>;
    // verify if package exist in the storage
    hasPackage(): Promise<boolean>;
  }

  // @deprecated use IBasicAuth from @verdaccio/auth
  interface IBasicAuth<T> {
    config: T & Config;
    aesEncrypt(buf: string): string;
    authenticate(user: string, password: string, cb: Callback): void;
    changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
    allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
    add_user(user: string, password: string, cb: Callback): any;
  }

  export interface Plugin<T> {
    new (config: T, options: PluginOptions<T>): T;
  }

  interface IPlugin<T> {
    version?: string;
    // In case a plugin needs to be cleaned up/removed
    close?(): void;
  }

  interface PluginOptions<T> {
    config: T & Config;
    logger: Logger;
  }

  // FIXME: error should be export type `VerdaccioError = HttpError & { code: number };`
  // instead of AuthError
  // but this type is on @verdaccio/core and cannot be used here yet (I don't know why)
  interface HttpError extends Error {
    status: number;
    statusCode: number;
    expose: boolean;
    headers?: {
      [key: string]: string;
    };
    [key: string]: any;
  }

  type AuthError = HttpError & { code: number };
  type AuthAccessCallback = (error: AuthError | null, access: boolean) => void;
  type AuthCallback = (error: AuthError | null, groups: string[] | false) => void;

  interface IPluginAuth<T> extends IPlugin<T> {
    authenticate(user: string, password: string, cb: AuthCallback): void;
    adduser?(user: string, password: string, cb: AuthCallback): void;
    changePassword?(user: string, password: string, newPassword: string, cb: AuthCallback): void;
    allow_publish?(user: RemoteUser, pkg: T & AuthPackageAllow, cb: AuthAccessCallback): void;
    allow_access?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
    allow_unpublish?(user: RemoteUser, pkg: T & AuthPackageAllow, cb: AuthAccessCallback): void;
    allow_publish?(
      user: RemoteUser,
      pkg: AllowAccess & PackageAccess,
      cb: AuthAccessCallback
    ): void;
    allow_access?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
    allow_unpublish?(
      user: RemoteUser,
      pkg: AllowAccess & PackageAccess,
      cb: AuthAccessCallback
    ): void;
    apiJWTmiddleware?(helpers: any): Function;
  }

  // @deprecated use @verdaccio/server
  interface IPluginMiddleware<T> extends IPlugin<T> {
    register_middlewares(app: any, auth: IBasicAuth<T>, storage: any): void;
  }

  interface IPluginStorageFilter<T> extends IPlugin<T> {
    filter_metadata(packageInfo: Manifest): Promise<Package>;
  }

  export type SearchResultWeb = {
    name: string;
    version: string;
    description: string;
  };
}
