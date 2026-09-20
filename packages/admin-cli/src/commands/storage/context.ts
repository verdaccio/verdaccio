import { Auth } from '@verdaccio/auth';
import { Config, getConfigParsed } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';
import { Storage } from '@verdaccio/store';
import type { ConfigYaml } from '@verdaccio/types';

export interface StorageContext {
  config: Config;
  storage: Storage;
  auth: Auth;
}

/**
 * Boot the minimum verdaccio stack a storage subcommand needs — config, logger,
 * storage and auth — mirroring the real server wiring but without the HTTP layer.
 */
export async function loadStorageContext(configPath?: string): Promise<StorageContext> {
  const parsed = getConfigParsed(configPath);
  await setup(parsed.log ?? {});
  // getConfigParsed always sets `configPath`, which is all the Config ctor needs.
  const config = new Config(parsed as ConfigYaml & { config_path: string });
  const storage = new Storage(config, logger);
  await storage.init(config);
  const auth = new Auth(config, logger);
  await auth.init();
  return { config, storage, auth };
}
