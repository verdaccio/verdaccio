// @flow

import type {
	UpLinkConf,
	Callback,
	Versions,
	Version,
	MergeTags,
	Config,
	Logger,
	Package} from '@verdaccio/types';
import type {
	IUploadTarball,
	IReadTarball,
} from '@verdaccio/streams';
import type {ILocalData} from '@verdaccio/local-storage';

export interface IAuth {
	config: Config;
	logger: Logger;
	secret: string;
	plugins: Array<any>;
}

export interface IWebSearch {
	index: any;
	storage: IStorageHandler;
	query(query: string): any;
	add(pkg: Version): void;
	remove(name: string): void;
	reindex(): void;
	configureStorage(storage: IStorageHandler): void;
}

export interface IProxy {
	config: UpLinkConf;
	failed_requests: number;
	userAgent: string;
	ca?: string | void;
	logger: Logger;
	server_id: string;
	url: any;
	maxage: number;
	timeout: number;
	max_fails: number;
	fail_timeout: number;
	upname: string;
	fetchTarball(url: string): IReadTarball;
	isUplinkValid(url: string): boolean;
}

export type ProxyList = {
	[key: string]: IProxy | null;
}

export type Utils = {
	ErrorCode: any;
	getLatestVersion: Callback;
	isObject: (value: any) => boolean;
	validate_name: (value: any) => boolean;
	tag_version: (value: any, version: string, tag: string) => void;
	normalize_dist_tags: (pkg: Package) => void;
	semverSort: (keys: Array<string>) => Array<string>;
}

export interface IStorageHandler {
	config: Config;
	localStorage: IStorage;
	logger: Logger;
	uplinks: ProxyList;
	addPackage(name: string, metadata: any, callback: Function): void;
	addVersion(name: string, version: string, metadata: Version, tag: string, callback: Callback): void;
	mergeTags(name: string, tagHash: MergeTags, callback: Callback): void;
	replace_tags(name: string, tagHash: MergeTags, callback: Callback): void;
	change_package(name: string, metadata: Package, revision: string, callback: Callback): void;
	remove_package(name: string, callback: Callback): void;
	remove_tarball(name: string, filename: string, revision: string, callback: Callback): void;
	add_tarball(name: string, filename: string): IUploadTarball;
	get_tarball(name: string, filename: string): IReadTarball;
	getPackage(options: any): void;
	search(startkey: string, options: any): void;
	getLocalDatabase(callback: Callback): void;
	_syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void;
	_updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void;
	_setupUpLinks(config: Config): void;
}

export interface IStorage {
	config: Config;
	localData: ILocalData;
	logger: Logger;
	addPackage(name: string, info: Package, callback: Callback): void;
	removePackage(name: string, callback: Callback): void;
	updateVersions(name: string, packageInfo: Package, callback: Callback): void;
	addVersion(name: string, version: string, metadata: Version, tag: string, callback: Callback): void;
	mergeTags(name: string, tags: MergeTags, callback: Callback): void;
	changePackage(name: string, metadata: Package, revision: string, callback: Callback): void;
	removeTarball(name: string, filename: string, revision: string, callback: Callback): void;
	addTarball(name: string, filename: string): IUploadTarball;
	getTarball(name: string, filename: string): IReadTarball;
	getPackageMetadata(name: string, callback: Callback): void;
	search(startKey: string, options: any): IUploadTarball;
}

