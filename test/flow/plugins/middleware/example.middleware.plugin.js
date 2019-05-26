// @flow

// this file is not aim to be tested, just to check flow definitions
import Config from '../../../../src/lib/config';
import {generatePackageTemplate} from '../../../../src/lib/storage-utils';
import {readFile} from '../../../functional/lib/test.utils';

const readMetadata = (fileName: string = 'metadata') => readFile(`../../unit/partials/${fileName}`);

import {
	Config as AppConfig,
	IPluginMiddleware,
	IStorageManager,
	RemoteUser,
	IBasicAuth,
} from '@verdaccio/types';
import { IUploadTarball, IReadTarball } from '@verdaccio/streams';

export default class ExampleMiddlewarePlugin implements IPluginMiddleware {
	register_middlewares(app: any, auth: IBasicAuth, storage: IStorageManager): void {
		const remoteUser: RemoteUser = {
			groups: [],
			real_groups: [],
			name: 'test'
		};
		auth.authenticate('user', 'password', () => {});
		auth.allow_access({packageName: 'packageName'}, remoteUser, () => {});
		auth.add_user('user', 'password', () => {});
		auth.aesEncrypt(new Buffer('pass'));
		// storage
		storage.addPackage('name', generatePackageTemplate('test'), () => {});
		storage.addVersion('name', 'version', readMetadata(), 'tag', () => {});
		storage.mergeTags('name', {'latest': '1.0.0'}, () => {});
		storage.changePackage('name', readMetadata(), 'revision', () => {});
		storage.removePackage('name', () => {});
		storage.mergeTags('name', {'latest': '1.0.0'}, () => {});
		storage.removeTarball('name', 'filename', 'revision', () => {});
		/* eslint no-unused-vars: 0 */
		const config1: AppConfig = new Config({
			storage: './storage',
			self_path: '/home/sotrage'
		});
		const add: IUploadTarball = storage.addTarball('name', 'filename');
		storage.getTarball('name', 'filename');
		const read: IReadTarball = storage.getTarball('name', 'filename');
		const search: IReadTarball = storage.search('test');
		/* eslint no-unused-vars: 0 */
	}
}

