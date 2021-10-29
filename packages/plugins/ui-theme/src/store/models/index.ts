import { Models } from '@rematch/core';

import { configuration } from './configuration';
import { download } from './download';
import { login } from './login';
import { manifest } from './manifest';
import { packages } from './packages';
import { search } from './search';

export interface RootModel extends Models<RootModel> {
  packages: typeof packages;
  manifest: typeof manifest;
  configuration: typeof configuration;
  download: typeof download;
  login: typeof login;
  search: typeof search;
}
export const models: RootModel = { packages, configuration, search, download, login, manifest };
