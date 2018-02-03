import fs from 'fs';
import path from 'path';

export default function getPackageVersion() {
  let packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));

  return packageJSON.version;
}

