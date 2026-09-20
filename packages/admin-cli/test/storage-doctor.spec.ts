import { describe, expect, test } from 'vitest';

import {
  TEMP_FILE_RE,
  findFileProblems,
  findMissingTarballs,
  findStaleDistfiles,
  getUplinkHosts,
} from '../src/commands/storage/doctor-checks';

describe('TEMP_FILE_RE', () => {
  test('matches tarball and packument temp names', () => {
    expect(TEMP_FILE_RE.test('pkg-1.0.0.tgz.tmp-123456')).toBe(true);
    expect(TEMP_FILE_RE.test('package.json.tmp987654')).toBe(true);
  });

  test('does not match real files', () => {
    expect(TEMP_FILE_RE.test('pkg-1.0.0.tgz')).toBe(false);
    expect(TEMP_FILE_RE.test('package.json')).toBe(false);
  });
});

describe('findFileProblems', () => {
  test('flags temp files and unreferenced tarballs, ignores package.json and referenced', () => {
    const files = [
      'package.json',
      'pkg-1.0.0.tgz',
      'pkg-1.0.0.tgz.tmp-42',
      'pkg-0.9.0.tgz',
      'readme.md',
    ];
    const problems = findFileProblems(files, ['pkg-1.0.0.tgz']);
    expect(problems).toEqual([
      { file: 'pkg-1.0.0.tgz.tmp-42', type: 'temp-file' },
      { file: 'pkg-0.9.0.tgz', type: 'orphan-tarball' },
    ]);
  });

  test('empty when everything is referenced and clean', () => {
    expect(findFileProblems(['package.json', 'a-1.0.0.tgz'], ['a-1.0.0.tgz'])).toEqual([]);
  });
});

describe('findMissingTarballs', () => {
  test('returns referenced tarballs not present on disk', () => {
    expect(findMissingTarballs(['a-1.0.0.tgz'], ['a-1.0.0.tgz', 'a-2.0.0.tgz'])).toEqual([
      'a-2.0.0.tgz',
    ]);
  });
});

describe('getUplinkHosts', () => {
  test('extracts hosts from configured uplink urls', () => {
    const hosts = getUplinkHosts({
      npmjs: { url: 'https://registry.npmjs.org/' },
      corp: { url: 'https://npm.corp.local:4873/' },
    });
    expect(hosts.has('registry.npmjs.org')).toBe(true);
    expect(hosts.has('npm.corp.local:4873')).toBe(true);
  });

  test('ignores missing/invalid urls', () => {
    expect(getUplinkHosts({ a: {}, b: { url: 'not a url' } }).size).toBe(0);
    expect(getUplinkHosts(undefined).size).toBe(0);
  });
});

describe('findStaleDistfiles', () => {
  const hosts = new Set(['registry.npmjs.org']);

  test('flags distfiles whose host is not a configured uplink', () => {
    const distfiles = {
      'a-1.0.0.tgz': { url: 'https://registry.npmjs.org/a/-/a-1.0.0.tgz', sha: 'x' },
      'b-1.0.0.tgz': { url: 'https://evil.example.com/b/-/b-1.0.0.tgz', sha: 'y' },
    };
    expect(findStaleDistfiles(distfiles, hosts)).toEqual([
      { file: 'b-1.0.0.tgz', host: 'evil.example.com' },
    ]);
  });

  test('flags entries with missing or unparseable url', () => {
    const distfiles = {
      'c.tgz': { sha: 'z' } as any,
      'd.tgz': { url: 'http://', sha: 'w' },
    };
    expect(
      findStaleDistfiles(distfiles, hosts)
        .map((s) => s.file)
        .sort()
    ).toEqual(['c.tgz', 'd.tgz']);
  });

  test('empty when all distfiles map to a configured uplink', () => {
    const distfiles = { 'a.tgz': { url: 'https://registry.npmjs.org/a/-/a.tgz', sha: 'x' } };
    expect(findStaleDistfiles(distfiles, hosts)).toEqual([]);
  });
});
