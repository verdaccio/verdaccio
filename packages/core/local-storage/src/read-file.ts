import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

export const readFilePromise = async (path) => {
  return await readFile(path, 'utf8');
};
