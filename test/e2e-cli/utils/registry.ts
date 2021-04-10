import { fork } from 'child_process';

export function prepareEnvironment(rootFolder: string, folderName: string) {}

export function spawnRegistry(verdaccioPath: string, args: string[], childOptions) {
  return new Promise((resolve, reject) => {
    let _childOptions = { silent: true, ...childOptions };

    const childFork = fork(verdaccioPath, args, _childOptions);

    childFork.on('message', (msg: {verdaccio_started: boolean}) => {
      if (msg.verdaccio_started) {
        resolve(childFork);
      }
    });

    childFork.on('error', (err) => reject([err]));
    childFork.on('disconnect', (err) => reject([err]));
    childFork.on('exit', (err) => reject([err]));
  });
}
