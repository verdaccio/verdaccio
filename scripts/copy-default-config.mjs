/* eslint-disable no-undef */
import { copyFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';

const sourceDir = './node_modules/@verdaccio/config/build/conf';
const targetDir = './conf';

try {
  await mkdir(targetDir, { recursive: true });

  const files = await readdir(sourceDir);

  const ymlFiles = files.filter((file) => file.endsWith('.yaml'));

  for (const file of ymlFiles) {
    const src = join(sourceDir, file);
    const dest = join(targetDir, file);
    await copyFile(src, dest);
    console.log(`✅ Copied ${file} to ${targetDir}`);
  }

  if (ymlFiles.length === 0) {
    console.log('ℹ️ No .yml files found to copy.');
  }
} catch (err) {
  console.error('❌ Error copying config files:', err);
}
