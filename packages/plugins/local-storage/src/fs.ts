import fsCallback from 'node:fs';
import * as fsP from 'node:fs/promises';

const readFile = fsP.readFile;
const mkdirPromise = fsP.mkdir;
const accessPromise = fsP.access;
const writeFilePromise = fsP.writeFile;
const readdirPromise = fsP.readdir;
const statPromise = fsP.stat;
const unlinkPromise = fsP.unlink;
const rmdirPromise = fsP.rmdir;
const renamePromise = fsP.rename;
const openPromise = fsP.open;

const readFilePromise = async (path) => {
  return await readFile(path, 'utf8');
};

function fstatPromise(fd: number): Promise<fsCallback.Stats> {
  return new Promise((resolve, reject) => {
    fsCallback.fstat(fd, function (err, stats) {
      if (err) {
        return reject(err);
      }
      return resolve(stats);
    });
  });
}

export {
  readFilePromise,
  renamePromise,
  mkdirPromise,
  writeFilePromise,
  readdirPromise,
  statPromise,
  accessPromise,
  unlinkPromise,
  rmdirPromise,
  openPromise,
  fstatPromise,
};
