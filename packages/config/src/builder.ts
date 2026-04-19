import { merge } from 'lodash-es';

import type {
  AuthConf,
  ConfigYaml,
  FlagsConfig,
  HttpsConf,
  ListenAddress,
  LoggerConfigItem,
  Notifications,
  PackageAccessYaml,
  PublishOptions,
  RateLimit,
  Security,
  ServerSettingsConf,
  UpLinkConf,
  WebConf,
} from '@verdaccio/types';

import { fromJStoYAML } from '.';

/**
 * Helper configuration builder constructor, used to build the configuration for testing or
 * programatically creating a configuration.
 */
export default class ConfigBuilder {
  private config: ConfigYaml;

  public constructor(config?: Partial<ConfigYaml>) {
    this.config = merge({ uplinks: {}, packages: {}, security: {} }, config);
  }

  public static build(config?: Partial<ConfigYaml>): ConfigBuilder {
    return new ConfigBuilder(config);
  }

  public addPackageAccess(pattern: string, pkgAccess: PackageAccessYaml) {
    // PackageAccessYaml uses string for publish/access while PackageAccess uses string[]
    // The config parser normalizes these later, so the cast is safe here
    (this.config.packages as Record<string, PackageAccessYaml>)[pattern] = pkgAccess;
    return this;
  }

  public addUplink(id: string, uplink: UpLinkConf) {
    this.config.uplinks[id] = uplink;
    return this;
  }

  public addSecurity(security: Partial<Security>) {
    this.config.security = merge(this.config.security, security);
    return this;
  }

  public addAuth(auth: Partial<AuthConf>) {
    this.config.auth = merge(this.config.auth, auth);
    return this;
  }

  public addLogger(log: LoggerConfigItem) {
    this.config.log = log;
    return this;
  }

  public addServer(server: Partial<ServerSettingsConf>) {
    this.config.server = merge(this.config.server, server);
    return this;
  }

  public addStorage(storage: string | object) {
    if (typeof storage === 'string') {
      this.config.storage = storage;
    } else {
      this.config.store = storage;
    }
    return this;
  }

  public addWeb(web: Partial<WebConf>) {
    this.config.web = merge(this.config.web, web);
    return this;
  }

  public addListen(listen: ListenAddress) {
    this.config.listen = listen;
    return this;
  }

  public addHttps(https: HttpsConf) {
    this.config.https = https;
    return this;
  }

  public addPublish(publish: Partial<PublishOptions>) {
    this.config.publish = merge(this.config.publish, publish);
    return this;
  }

  public addFlags(flags: Partial<FlagsConfig>) {
    this.config.flags = merge(this.config.flags, flags);
    return this;
  }

  public addNotify(notify: Notifications | Notifications[]) {
    this.config.notify = notify;
    return this;
  }

  public addMiddlewares(middlewares: any) {
    this.config.middlewares = merge(this.config.middlewares, middlewares);
    return this;
  }

  public addFilters(filters: any) {
    this.config.filters = merge(this.config.filters, filters);
    return this;
  }

  public addMaxBodySize(maxBodySize: string) {
    this.config.max_body_size = maxBodySize;
    return this;
  }

  public addUserRateLimit(rateLimit: RateLimit) {
    this.config.userRateLimit = merge(this.config.userRateLimit, rateLimit);
    return this;
  }

  public addUrlPrefix(urlPrefix: string) {
    this.config.url_prefix = urlPrefix;
    return this;
  }

  public addI18n(i18n: ConfigYaml['i18n']) {
    this.config.i18n = i18n;
    return this;
  }

  public addUserAgent(userAgent: string) {
    this.config.user_agent = userAgent;
    return this;
  }

  public addHttpProxy(httpProxy: string) {
    this.config.http_proxy = httpProxy;
    return this;
  }

  public addHttpsProxy(httpsProxy: string) {
    this.config.https_proxy = httpsProxy;
    return this;
  }

  public addNoProxy(noProxy: string) {
    this.config.no_proxy = noProxy;
    return this;
  }

  public addPlugins(plugins: string) {
    this.config.plugins = plugins;
    return this;
  }

  public addNotifications(notifications: Notifications) {
    this.config.notifications = notifications;
    return this;
  }

  public getConfig(): ConfigYaml {
    return this.config;
  }

  public getAsYaml(): string {
    return fromJStoYAML(this.config) as string;
  }
}
