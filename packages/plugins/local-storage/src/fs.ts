import fs from 'fs/promises';

const readFile = fs.readFile;
const mkdirPromise = fs.mkdir;
const writeFilePromise = fs.writeFile;
const readdirPromise = fs.readdir;
const statPromise = fs.stat;
const unlinkPromise = fs.unlink;
const rmdirPromise = fs.rmdir;
const renamePromise = fs.rename;

export const readFilePromise = async (path) => {
  return await readFile(path, 'utf8');
};

export {
  renamePromise,
  mkdirPromise,
  writeFilePromise,
  readdirPromise,
  statPromise,
  unlinkPromise,
  rmdirPromise,
};
