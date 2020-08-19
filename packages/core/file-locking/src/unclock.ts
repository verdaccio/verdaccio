import locker from 'lockfile';
import { Callback } from '@verdaccio/types';

// unlocks file by removing existing lock file
export function unlockFile(name: string, next: Callback): void {
  const lockFileName = `${name}.lock`;
  locker.unlock(lockFileName, function () {
    return next(null);
  });
}
