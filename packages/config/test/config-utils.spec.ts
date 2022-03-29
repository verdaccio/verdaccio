import path from 'path';

import { fileExists, folderExists } from '../src/config-utils';

describe('config-utils', () => {
  test('folderExists', () => {
    expect(folderExists(path.join(__dirname, './partials/exist'))).toBeTruthy();
  });

  test('folderExists == false', () => {
    expect(folderExists(path.join(__dirname, './partials/NOT_exist'))).toBeFalsy();
  });

  test('fileExists', () => {
    expect(fileExists(path.join(__dirname, './partials/exist/README.md'))).toBeTruthy();
  });

  test('fileExists == false', () => {
    expect(fileExists(path.join(__dirname, './partials/exist/NOT_EXIST.md'))).toBeFalsy();
  });
});
