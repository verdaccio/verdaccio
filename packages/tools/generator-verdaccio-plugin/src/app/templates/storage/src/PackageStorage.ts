import { getConflict, getInternalError, getNotFound } from '@verdaccio/commons-api';
import { ReadTarball, UploadTarball } from '@verdaccio/streams';
import {
  Callback,
  CallbackAction,
  ILocalPackageManager,
  Logger,
  Package,
  PackageTransformer,
  ReadPackageCallback,
  StorageUpdateCallback,
  StorageWriteCallback,
} from '@verdaccio/types';

import { CustomConfig } from '../types/index';

export default class StoragePluginManage implements ILocalPackageManager {
  public logger: Logger;
  public packageName: string;
  public config: CustomConfig;

  public constructor(config: CustomConfig, packageName: string, logger: Logger) {
    this.logger = logger;
    this.packageName = packageName;
    this.config = config;
  }

  /**
   * Handle a metadata update and
   * @param name
   * @param updateHandler
   * @param onWrite
   * @param transformPackage
   * @param onEnd
   */
  public updatePackage(
    name: string,
    updateHandler: StorageUpdateCallback,
    onWrite: StorageWriteCallback,
    transformPackage: PackageTransformer,
    onEnd: CallbackAction
  ): void {
    /**
     * Example of implementation:
      this.customStore.get().then((pkg: Package) => {
        updateHandler(pkg, function onUpdateFinish(err) {
          if (err) {
            onEnd(err);
          } else {
            onWrite(name, pkg, onEnd);
          }
        })
      });
     */
  }

  /**
   * Delete a specific file (tarball or package.json)
   * @param fileName
   * @param callback
   */
  public deletePackage(fileName: string, callback: CallbackAction): void {
    /**
     * Example of implementation:
     this.customStore.delete(fileName,  (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      })
     */
  }

  /**
   * Delete a package (folder, path)
   * This happens after all versions ar tarballs have been removed.
   * @param callback
   */
  public removePackage(callback: CallbackAction): void {
    /**
     * Example of implementation:
      this.customStore.removePackage((err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      })
     */
  }

  /**
   * Publish a new package (version).
   * @param name
   * @param data
   * @param callback
   */
  public createPackage(name: string, data: Package, callback: CallbackAction): void {
    /**
     * Example of implementation:
     * this.customStore.create(name, data).then(err => {
        if (err.notFound) {
          callback(getNotFound());
        } else if (err.alreadyExist) {
          callback(getConflict());
        } else {
          callback(null);
        }
      })
     */
  }

  /**
   * Perform write anobject to the storage.
   * Similar to updatePackage but without middleware handlers
   * @param pkgName package name
   * @param pkg package metadata
   * @param callback
   */
  public savePackage(pkgName: string, pkg: Package, callback: CallbackAction): void {
    /*
      Example of implementation:
      this.cumstomStore.write(pkgName, pkgName).then(data => {
        callback(null);
      }).catch(err => {
        callback(getInternalError(err.message));
      })
    */
  }

  /**
   * Read a package from storage
   * @param pkgName package name
   * @param callback
   */
  public readPackage(pkgName: string, callback: ReadPackageCallback): void {
    /**
     * Example of implementation:
     * this.customStorage.read(name, (err, pkg: Package) => {
          if (err.fooError) {
            callback(getInternalError(err))
          } else if (err.barError) {
            callback(getNotFound());
          } else {
            callback(null, pkg)
          }
      });
     */
  }

  /**
   * Create writtable stream (write a tarball)
   * @param name
   */
  public writeTarball(name: string): UploadTarball {
    /**
       * Example of implementation:
       * const stream = new UploadTarball({});
         return stream;
       */
  }

  /**
   * Create a readable stream (read a from a tarball)
   * @param name
   */
  public readTarball(name: string): ReadTarball {
    /**
     * Example of implementation:
     * const stream = new ReadTarball({});
       return stream;
     */
  }
}
