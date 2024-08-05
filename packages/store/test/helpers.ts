import { pseudoRandomBytes } from 'crypto';
import buildDebug from 'debug';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { parseConfigFile } from '@verdaccio/config';
import { Config, getDefaultConfig } from '@verdaccio/config';
import { ConfigYaml, PackageUsers } from '@verdaccio/types';

const debug = buildDebug('verdaccio:storage:test:helpers');

export const domain = 'https://registry.npmjs.org';

/**
 * Override the default.yaml configuration file with any new config provided.
 */
export function configExample(externalConfig: any = {}, configFile?: string, location?: string) {
  let config = {};
  if (location && configFile) {
    const locationFile = path.join(location, configFile);
    debug('config location: %s', locationFile);
    config = parseConfigFile(locationFile);
    debug('config file: %o', JSON.stringify(config));
  }
  return { ...externalConfig, ...config };
}

export function generateRandomStorage() {
  const tempStorage = pseudoRandomBytes(5).toString('hex');
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-test'));

  return path.join(tempRoot, tempStorage);
}

export const getConfig = (file, override: Partial<ConfigYaml> = {}): Config => {
  const config = new Config(
    configExample(
      {
        ...getDefaultConfig(),
        storage: generateRandomStorage(),
        ...override,
      },
      `./fixtures/config/${file}`,
      __dirname
    )
  );
  return config;
};

export const defaultRequestOptions = {
  host: 'localhost',
  protocol: 'http',
  headers: {},
};
export const executeStarPackage = async (
  storage,
  options: {
    users: PackageUsers;
    username: string;
    name: string;
    _rev: string;
    _id?: string;
  }
) => {
  const { name, _rev, _id, users, username } = options;
  const starManifest = {
    _rev,
    _id,
    users,
  };
  return storage.updateManifest(starManifest, {
    signal: new AbortController().signal,
    name,
    uplinksLook: true,
    revision: '1',
    requestOptions: { ...defaultRequestOptions, username },
  });
};
