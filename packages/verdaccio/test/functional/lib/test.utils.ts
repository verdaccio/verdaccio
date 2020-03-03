import crypto  from 'crypto';
import fs from 'fs';
import path from 'path';

function generateSha(key) {
  // @ts-ignore
  return crypto.createHash('sha1', 'binary').update(key).digest('hex');
}

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, `/${filePath}`));
}

export { generateSha, readFile }
