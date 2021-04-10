declare module 'lockfile' {
  type Callback = (err?: Error) => void;

  interface LockOptions {
    wait?: number;
    pollPeriod?: number;
    stale?: number;
    retries?: number;
    retryWait?: number;
  }

  interface LockFileExport {
    lock(fileName: string, opts: LockOptions, cb: Callback): void;
    unlock(fileName: string, cb: Callback): void;
  }

  const lockFileExport: LockFileExport;

  export default lockFileExport;
}
