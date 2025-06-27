import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function generateSha(key) {
  // @ts-ignore
  return (
    crypto
      // @ts-ignore
      .createHash('sha1', 'binary')
      .update(key)
      .digest('hex')
  );
}

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, `/${filePath}`));
}

export { generateSha, readFile };
