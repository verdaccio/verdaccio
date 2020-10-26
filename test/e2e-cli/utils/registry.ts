/* eslint-disable prefer-promise-reject-errors */
import { fork } from 'child_process';

export function spawnRegistry(verdaccioPath: string, args: string[], childOptions) {
  return new Promise((resolve, reject) => {
    let _childOptions = { silent: true, ...childOptions };

    const childFork = fork(verdaccioPath, args, _childOptions);

    childFork.on('message', (msg) => {
      if ('verdaccio_started' in msg) {
        resolve(childFork);
      }
    });

    childFork.on('error', (err) => reject([err]));
    childFork.on('disconnect', (err) => reject([err]));
    childFork.on('exit', (err) => reject([err]));
  });
}
