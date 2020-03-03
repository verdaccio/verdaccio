import fs from 'fs';
import path from 'path';

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, `/${filePath}`));
}

export { readFile }
