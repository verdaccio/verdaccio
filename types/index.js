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
import type {NextFunction, $Request, $Response} from 'request';

export type StringValue = string | void | null;

export interface IAuth {
	config: Config;
	logger: Logger;
	secret: string;
	plugins: Array<any>;
	aes_encrypt(buf: Buffer): Buffer;
	apiJWTmiddleware(): $NextFunctionVer;
  webUIJWTmiddleware(): $NextFunctionVer;
	authenticate(user: string, password: string, cb: Callback): void;
	allow_access(packageName: string, user: string, callback: Callback): void;
  issueUIjwt(user: string, time: string): string;
	add_user(user: string, password: string, cb: Callback): any;
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
	getRemoteMetadata(name: string, options: any, callback: Callback): void;
}

export type ProxyList = {
	[key: string]: IProxy;
}

export type Utils = {
	ErrorCode: any;
	getLatestVersion: Callback;
	isObject: (value: any) => boolean;
	validate_name: (value: any) => boolean;
	tag_version: (value: any, version: string, tag: string) => void;
	normalizeDistTags: (pkg: Package) => void;
	semverSort: (keys: Array<string>) => Array<string>;
}

export interface IStorageHandler {
	config: Config;
	localStorage: IStorage;
	logger: Logger;
	uplinks: ProxyList;
	addPackage(name: string, metadata: any, callback: Function): Promise<any>;
	init(config: Config): Promise<any>;
	addVersion(name: string, version: string, metadata: Version, tag: StringValue, callback: Callback): void;
	mergeTags(name: string, tagHash: MergeTags, callback: Callback): void;
	replaceTags(name: string, tagHash: MergeTags, callback: Callback): void;
	changePackage(name: string, metadata: Package, revision: string, callback: Callback): void;
	removePackage(name: string, callback: Callback): void;
	removeTarball(name: string, filename: string, revision: string, callback: Callback): void;
	addTarball(name: string, filename: string): IUploadTarball;
	getTarball(name: string, filename: string): IReadTarball;
	getPackage(options: any): void;
	search(startkey: string, options: any): void;
	getLocalDatabase(callback: Callback): void;
	_syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void;
	_updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void;
}

export interface IStorage {
	config: Config;
	localData: ILocalData;
	logger: Logger;
	addPackage(name: string, info: Package, callback: Callback): void;
	removePackage(name: string, callback: Callback): void;
	updateVersions(name: string, packageInfo: Package, callback: Callback): void;
	addVersion(name: string, version: string, metadata: Version, tag: StringValue, callback: Callback): void;
	mergeTags(name: string, tags: MergeTags, callback: Callback): void;
	changePackage(name: string, metadata: Package, revision: string, callback: Callback): void;
	removeTarball(name: string, filename: string, revision: string, callback: Callback): void;
	addTarball(name: string, filename: string): IUploadTarball;
	getTarball(name: string, filename: string): IReadTarball;
	getPackageMetadata(name: string, callback: Callback): void;
	search(startKey: string, options: any): IUploadTarball;
  getSecret(config: Config): Promise<any>;
}

export type $RequestExtend = $Request & {remote_user?: any}
export type $ResponseExtend = $Response & {cookies?: any}
export type $NextFunctionVer = NextFunction & mixed;
export type $SidebarPackage = Package & {latest: mixed}
