import { merge } from 'lodash-es';

import type {
  AuthConf,
  ConfigYaml,
  LoggerConfigItem,
  PackageAccessYaml,
  Security,
  ServerSettingsConf,
  UpLinkConf,
} from '@verdaccio/types';

import { fromJStoYAML } from '.';

/**
 * Helper configuration builder constructor, used to build the configuration for testing or
 * programatically creating a configuration.
 */
export default class ConfigBuilder {
  private config: ConfigYaml;

  public constructor(config?: Partial<ConfigYaml>) {
    this.config = merge(config, { uplinks: {}, packages: {}, security: {} });
  }

  public static build(config?: Partial<ConfigYaml>): ConfigBuilder {
    return new ConfigBuilder(config);
  }

  public addPackageAccess(pattern: string, pkgAccess: PackageAccessYaml) {
    // @ts-ignore
    this.config.packages[pattern] = pkgAccess;
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

  public getConfig(): ConfigYaml {
    return this.config;
  }

  public getAsYaml(): string {
    return fromJStoYAML(this.config) as string;
  }
}
