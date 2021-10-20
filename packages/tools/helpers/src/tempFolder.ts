import os from 'os';
import fs from 'fs';
import path from 'path';

export function createTemporaryFolder(id: string) {
  return fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), id));
}
