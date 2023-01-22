import fsCallback from 'fs';
import fs from 'fs';

const readFile = fs.promises.readFile;
const mkdirPromise = fs.promises.mkdir;
const accessPromise = fs.promises.access;
const writeFilePromise = fs.promises.writeFile;
const readdirPromise = fs.promises.readdir;
const statPromise = fs.promises.stat;
const unlinkPromise = fs.promises.unlink;
const rmdirPromise = fs.promises.rmdir;
const renamePromise = fs.promises.rename;
const openPromise = fs.promises.open;

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
