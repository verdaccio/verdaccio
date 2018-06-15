// @flow

import {DEFAULT_REVISION, normalizePackage} from "../../src/lib/storage-utils";
import {DIST_TAGS} from "../../src/lib/utils";
import {readFile} from "../functional/lib/test.utils";

const readMetadata = (fileName: string = 'metadata') => readFile(`../../unit/partials/${fileName}`);

describe('Storage Utils', () => {
  test('normalizePackage clean', () => {
    const pkg = normalizePackage({
      _attachments: {},
      _distfiles: {},
      _rev: '',
      _uplinks: {},
      name: '',
      versions: {},
      [DIST_TAGS]: {},
    });
    expect(pkg).toBeDefined();
    expect(pkg.time).toBeInstanceOf(Object);
    expect(pkg.versions).toBeInstanceOf(Object);
    expect(pkg[DIST_TAGS]).toBeInstanceOf(Object);
    expect(pkg._distfiles).toBeInstanceOf(Object);
    expect(pkg._attachments).toBeInstanceOf(Object);
    expect(pkg._uplinks).toBeInstanceOf(Object);
  });

  test('normalizePackage partial metadata', () => {
    const pkg = normalizePackage(readMetadata('metadata'));
    expect(pkg).toBeDefined();
    expect(pkg.time).toBeInstanceOf(Object);
    expect(pkg.versions).toBeInstanceOf(Object);
    expect(pkg[DIST_TAGS]).toBeInstanceOf(Object);
    expect(pkg._distfiles).toBeInstanceOf(Object);
    expect(pkg._attachments).toBeInstanceOf(Object);
    expect(pkg._uplinks).toBeInstanceOf(Object);
  });

  test('normalizePackage partial default revision', () => {
    const pkg = normalizePackage(readMetadata('metadata'));
    expect(pkg).toBeDefined();
    expect(pkg._rev).toBeDefined();
    expect(pkg._rev).toBe(DEFAULT_REVISION);
  });
});
