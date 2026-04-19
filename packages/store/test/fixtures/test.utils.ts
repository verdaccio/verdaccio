import fs from 'node:fs';
import path from 'node:path';

function readFile(filePath) {
  return fs.readFileSync(path.join(import.meta.dirname, `/${filePath}`));
}

export { readFile };
