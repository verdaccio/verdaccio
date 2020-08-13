// this file is not aim to be tested, just to check typescript definitions
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import Config from '../../../../packages/config/src/config';
import { generatePackageTemplate } from '@verdaccio/store';
import { readFile } from '../../../functional/lib/test.utils';
import { Package } from '@verdaccio/types';

const readMetadata = (fileName: string): Package => JSON.parse(readFile(`../../unit/partials/${fileName}`).toString()) as Package;

import { Config as AppConfig, IPluginMiddleware, IStorageManager, RemoteUser, IBasicAuth } from '@verdaccio/types';
import { IUploadTarball, IReadTarball } from '@verdaccio/streams';
import { generateVersion } from '../../../unit/__helper/utils';

export default class ExampleMiddlewarePlugin implements IPluginMiddleware<{}> {
  register_middlewares(app: any, auth: IBasicAuth<{}>, storage: IStorageManager<{}>): void {
    const remoteUser: RemoteUser = {
      groups: [],
      real_groups: [],
      name: 'test',
    };
    auth.authenticate('user', 'password', () => {});
    auth.allow_access({ packageName: 'packageName' }, remoteUser, () => {});
    auth.add_user('user', 'password', () => {});
    auth.aesEncrypt(new Buffer('pass'));
    // storage
    storage.addPackage('name', generatePackageTemplate('test'), () => {});
    storage.addVersion('name', 'version', generateVersion('name', '1.0.0'), 'tag', () => {});
    storage.mergeTags('name', { latest: '1.0.0' }, () => {});
    storage.changePackage('name', readMetadata('metadata'), 'revision', () => {});
    storage.removePackage('name', () => {});
    storage.mergeTags('name', { latest: '1.0.0' }, () => {});
    storage.removeTarball('name', 'filename', 'revision', () => {});
    const config1: AppConfig = new Config({
      storage: './storage',
      self_path: '/home/sotrage',
    });
    const add: IUploadTarball = storage.addTarball('name', 'filename');
    storage.getTarball('name', 'filename');
    const read: IReadTarball = storage.getTarball('name', 'filename');
    const search: IReadTarball = storage.search('test', {});
  }
}
