import { PackageAccess, PackageList } from './manifest';

export type TypeToken = 'Bearer' | 'Basic';

export interface Logger {
  child: (conf: any) => any;
  debug: (conf: any, template?: string) => void;
  error: (conf: any, template?: string) => void;
  http: (conf: any, template?: string) => void;
  trace: (conf: any, template?: string) => void;
  warn: (conf: any, template?: string) => void;
  info: (conf: any, template?: string) => void;
}

export type LoggerType = 'stdout' | 'file';
export type LoggerFormat = 'pretty' | 'pretty-timestamped' | 'json';
export type LoggerLevel = 'http' | 'fatal' | 'warn' | 'info' | 'debug' | 'trace';

export type LoggerConfigItem = {
  type?: LoggerType;
  /**
   * The format
   */
  format?: LoggerFormat;
  path?: string;
  level?: string;
  colors?: boolean;
  async?: boolean;
};

export interface ConfigWithHttps extends Config {
  https: HttpsConf;
}

export interface PackageAccessYaml {
  storage?: string;
  publish?: string;
  proxy?: string;
  access?: string;
  unpublish?: string;
}

export interface LoggerConfItem {
  type: LoggerType;
  format: LoggerFormat;
  level: LoggerLevel;
}

export interface Headers {
  [key: string]: string;
}

export interface UpLinkTokenConf {
  type: TypeToken;
  token?: string;
  token_env?: boolean | string;
}

export interface UpLinkConf {
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

export type RateLimit = {
  windowMs?: number;
  max?: number;
};

// export interface WebConf {
//   enable?: boolean;
//   title?: string;
//   logo?: string;
//   favicon?: string;
//   gravatar?: boolean;
//   sort_packages?: string;
//   rateLimit?: RateLimit;
// }

export type FlagsConfig = {
  searchRemote?: boolean;
  changePassword?: boolean;
};

export type PackageManagers = 'pnpm' | 'yarn' | 'npm';

// FUTURE: WebConf and TemplateUIOptions should be merged .
export type CommonWebConf = {
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
  primaryColor: string;
  version?: string;
  logoURI?: string;
  flags: FlagsConfig;
} & CommonWebConf;

/**
 * Options on config.yaml for web
 */
export type WebConf = {
  // FIXME: rename to primaryColor and move it to CommonWebConf
  primary_color?: string;
  enable?: boolean;
  scriptsHead?: string[];
  scriptsBodyAfter?: string[];
  metaScripts?: string[];
  bodyBefore?: string[];
  bodyAfter?: string[];
} & CommonWebConf;

export interface UpLinksConfList {
  [key: string]: UpLinkConf;
}

export interface AuthHtpasswd {
  file: string;
  max_users: number;
}

export type AuthConf = any | AuthHtpasswd;

export interface JWTOptions {
  sign: JWTSignOptions;
  verify: JWTVerifyOptions;
}

export interface JWTSignOptions {
  algorithm?: string;
  expiresIn?: string;
  notBefore?: string;
  ignoreExpiration?: boolean;
  maxAge?: string | number;
  clockTimestamp?: number;
}

export interface JWTVerifyOptions {
  algorithm?: string;
  expiresIn?: string;
  notBefore?: string | number;
  ignoreExpiration?: boolean;
  maxAge?: string | number;
  clockTimestamp?: number;
}

export interface APITokenOptions {
  legacy: boolean;
  jwt?: JWTOptions;
}

export interface Security {
  web: JWTOptions;
  api: APITokenOptions;
}

export interface PublishOptions {
  allow_offline: boolean;
}

export interface ListenAddress {
  [key: string]: string;
}

export interface HttpsConfKeyCert {
  key: string;
  cert: string;
  ca?: string;
}

export interface HttpsConfPfx {
  pfx: string;
  passphrase?: string;
}

export type HttpsConf = HttpsConfKeyCert | HttpsConfPfx;

export interface Notifications {
  method: string;
  packagePattern: RegExp;
  packagePatternFlags: string;
  endpoint: string;
  content: string;
  headers: Headers;
}

export type Notification = Notifications;

export type ServerSettingsConf = {
  // express-rate-limit settings
  rateLimit: RateLimit;
  keepAliveTimeout?: number;
  /**
   * Plugins should be prefixed verdaccio-XXXXXX by default.
   * To override the default prefix, use this property without `-`
   * If you set pluginPrefix: acme, the packages to resolve will be
   * acme-XXXXXX
   */
  pluginPrefix?: string;
  passwordValidationRegex?: RegExp;
};

/**
 * YAML configuration file available options.
 */
export interface ConfigYaml {
  _debug?: boolean;
  storage?: string | void;
  packages: PackageList;
  uplinks: UpLinksConfList;
  log?: LoggerConfItem;
  web?: WebConf;
  auth?: AuthConf;
  security: Security;
  publish?: PublishOptions;
  store?: any;
  listen?: ListenAddress;
  https?: HttpsConf;
  http_proxy?: string;
  plugins?: string | void | null;
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
 * Configuration object with additional methods for configuration, includes yaml and internal medatada.
 * @interface Config
 * @extends {ConfigYaml}
 */
export interface Config extends Omit<ConfigYaml, 'packages' | 'security' | 'configPath'> {
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

export interface AllowAccess {
  name: string;
  version?: string;
  tag?: string;
}

// info passed to the auth plugin when a package is package is being published

export interface AuthPackageAllow extends PackageAccess, AllowAccess {}
