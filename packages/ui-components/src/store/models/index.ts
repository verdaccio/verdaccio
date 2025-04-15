import { Models } from '@rematch/core';

import { addUser } from './add-user';
import { changePassword } from './change-password';
import { configuration } from './configuration';
import { download } from './download';
import { login } from './login';
import { loginV1 } from './login-v1';
import { manifest } from './manifest';
import { packages } from './packages';
import { search } from './search';

export interface RootModel extends Models<RootModel> {
  packages: typeof packages;
  manifest: typeof manifest;
  configuration: typeof configuration;
  download: typeof download;
  login: typeof login;
  loginV1: typeof loginV1;
  search: typeof search;
  addUser: typeof addUser;
  changePassword: typeof changePassword;
}

export const models: RootModel = {
  packages,
  configuration,
  search,
  download,
  login,
  loginV1,
  manifest,
  addUser,
  changePassword,
};
