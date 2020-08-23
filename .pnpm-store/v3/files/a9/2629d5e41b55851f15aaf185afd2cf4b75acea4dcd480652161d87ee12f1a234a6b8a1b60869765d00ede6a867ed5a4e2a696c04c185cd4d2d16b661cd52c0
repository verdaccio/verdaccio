// flow-typed signature: 495348fe7e36289229ca4b9b8cbad572
// flow-typed version: 9821eaaefe/lockfile_v1.x.x/flow_>=v0.47.x

declare module 'lockfile' {

  declare type Callback = (err: ?Error) => void | mixed;

  declare type LockOptions = {
    wait?: number,
    pollPeriod?: number,
    stale?: number,
    retries?: number,
    retryWait?: number
  };

  declare interface LockFileExport  {
    lock(fileName: string, opts: LockOptions, cb: Callback): void;
    unlock(fileName: string, cb: Callback): void
  }

  declare module.exports: LockFileExport;
}
