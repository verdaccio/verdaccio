import defaultStartServer from '@verdaccio/server';
import type { ConfigYaml } from '@verdaccio/types';

export type ServerFactory = (config: ConfigYaml) => Promise<any>;

export interface CliRuntimeOptions {
  /**
   * The server factory used by the default (start) command. Defaults to
   * `@verdaccio/server`. Downstream distributions (e.g. a registry that needs a
   * custom Storage) can inject their own factory here.
   */
  startServer?: ServerFactory;
  /** Version string reported by `--version` and the startup banner. */
  version?: string;
  /** Process/package name reported on startup. */
  pkgName?: string;
}

let _startServer: ServerFactory = defaultStartServer;
let _version: string | undefined;
let _pkgName: string | undefined;

export function configureCli(options: CliRuntimeOptions = {}): void {
  if (options.startServer) {
    _startServer = options.startServer;
  }
  if (options.version) {
    _version = options.version;
  }
  if (options.pkgName) {
    _pkgName = options.pkgName;
  }
}

export function getStartServer(): ServerFactory {
  return _startServer;
}

export function getVersionOverride(): string | undefined {
  return _version;
}

export function getPkgNameOverride(): string | undefined {
  return _pkgName;
}
