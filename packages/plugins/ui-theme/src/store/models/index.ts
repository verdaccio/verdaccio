import { Models } from '@rematch/core';

import { configuration } from './configuration';
import { download } from './download';
import { login } from './login';
import { manifest } from './manifest';
import { packages } from './packages';
export interface RootModel extends Models<RootModel> {
  packages: typeof packages;
  manifest: typeof manifest;
  configuration: typeof configuration;
  download: typeof download;
  login: typeof login;
}
export const models: RootModel = { packages, configuration, download, login, manifest };
