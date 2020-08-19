import { PassThrough, TransformOptions } from 'stream';

export interface IReadTarball {
  abort?: () => void;
}

export interface IUploadTarball {
  done?: () => void;
  abort?: () => void;
}

/**
 * This stream is used to read tarballs from repository.
 * @param {*} options
 * @return {Stream}
 */
class ReadTarball extends PassThrough implements IReadTarball {
  /**
   *
   * @param {Object} options
   */
  public constructor(options: TransformOptions) {
    super(options);
    // called when data is not needed anymore
    addAbstractMethods(this, 'abort');
  }

  public abort(): void {}
}

/**
 * This stream is used to upload tarballs to a repository.
 * @param {*} options
 * @return {Stream}
 */
class UploadTarball extends PassThrough implements IUploadTarball {
  /**
   *
   * @param {Object} options
   */
  public constructor(options: any) {
    super(options);
    // called when user closes connection before upload finishes
    addAbstractMethods(this, 'abort');

    // called when upload finishes successfully
    addAbstractMethods(this, 'done');
  }

  public abort(): void {}
  public done(): void {}
}

/**
 * This function intercepts abstract calls and replays them allowing.
 * us to attach those functions after we are ready to do so
 * @param {*} self
 * @param {*} name
 */
// Perhaps someone knows a better way to write this
function addAbstractMethods(self: any, name: any): void {
  self._called_methods = self._called_methods || {};

  self.__defineGetter__(name, function () {
    return function (): void {
      self._called_methods[name] = true;
    };
  });

  self.__defineSetter__(name, function (fn: any) {
    delete self[name];

    self[name] = fn;

    if (self._called_methods && self._called_methods[name]) {
      delete self._called_methods[name];

      self[name]();
    }
  });
}

export { ReadTarball, UploadTarball };
