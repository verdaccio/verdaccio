/// <reference types="node" />
import { ReadTarball } from '@verdaccio/streams';
import { Callback, Logger, Package, ILocalPackageManager, IUploadTarball } from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api/lib';
export declare const fileExist = "EEXISTS";
export declare const noSuchFile = "ENOENT";
export declare const resourceNotAvailable = "EAGAIN";
export declare const pkgFileName = "package.json";
export declare const fSError: (message: string, code?: number) => VerdaccioError;
export declare type ILocalFSPackageManager = ILocalPackageManager & {
    path: string;
};
export default class LocalFS implements ILocalFSPackageManager {
    path: string;
    logger: Logger;
    constructor(path: string, logger: Logger);
    /**
      *  This function allows to update the package thread-safely
        Algorithm:
        1. lock package.json for writing
        2. read package.json
        3. updateFn(pkg, cb), and wait for cb
        4. write package.json.tmp
        5. move package.json.tmp package.json
        6. callback(err?)
      * @param {*} name
      * @param {*} updateHandler
      * @param {*} onWrite
      * @param {*} transformPackage
      * @param {*} onEnd
      */
    updatePackage(name: string, updateHandler: Callback, onWrite: Callback, transformPackage: Function, onEnd: Callback): void;
    deletePackage(packageName: string, callback: (err: NodeJS.ErrnoException | null) => void): void;
    removePackage(callback: (err: NodeJS.ErrnoException | null) => void): void;
    createPackage(name: string, value: Package, cb: Callback): void;
    savePackage(name: string, value: Package, cb: Callback): void;
    readPackage(name: string, cb: Callback): void;
    writeTarball(name: string): IUploadTarball;
    readTarball(name: string): ReadTarball;
    private _createFile;
    private _readStorageFile;
    private _convertToString;
    private _getStorage;
    private _writeFile;
    private _lockAndReadJSON;
    private _unlockJSON;
}
