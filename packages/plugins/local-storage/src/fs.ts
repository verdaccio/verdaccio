import fsCallback from 'fs';
import fs from 'fs/promises';

const readFile = fs.readFile;
const mkdirPromise = fs.mkdir;
const accessPromise = fs.access;
const writeFilePromise = fs.writeFile;
const readdirPromise = fs.readdir;
const statPromise = fs.stat;
const unlinkPromise = fs.unlink;
const rmdirPromise = fs.rmdir;
const renamePromise = fs.rename;
const openPromise = fs.open;

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
