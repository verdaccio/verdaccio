import { promisify } from 'util';
import fs from 'fs';

// FUTURE: when v15 is min replace by fs/promises
const readFile = promisify(fs.readFile);
const mkdirPromise = promisify(fs.mkdir);
const writeFilePromise = promisify(fs.writeFile);
const readdirPromise = promisify(fs.readdir);
const statPromise = promisify(fs.stat);
const unlinkPromise = promisify(fs.unlink);
const rmdirPromise = promisify(fs.rmdir);

export const readFilePromise = async (path) => {
  return await readFile(path, 'utf8');
};

export { mkdirPromise, writeFilePromise, readdirPromise, statPromise, unlinkPromise, rmdirPromise };
