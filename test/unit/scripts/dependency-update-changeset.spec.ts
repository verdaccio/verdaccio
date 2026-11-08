import { describe, expect, test } from 'vitest';

import {
  bumpedPackages,
  entriesBetween,
  highestLevel,
  mergeEntries,
  parseChangelog,
  renderChangeset,
  runtimePackages,
} from '../../../scripts/dependency-update-changeset.mjs';

const baseLock = `
packages:

  '@verdaccio/core@9.0.0-next-9.41':
    resolution: {integrity: sha512-a}

  '@verdaccio/server@9.0.0-next-9.41':
    resolution: {integrity: sha512-b}

  '@verdaccio/test-helper@5.0.0-next-9.42':
    resolution: {integrity: sha512-c}

  verdaccio-htpasswd@14.0.0-next-9.41:
    resolution: {integrity: sha512-d}

  express@5.3.0:
    resolution: {integrity: sha512-e}
`;

const headLock = `
packages:

  '@verdaccio/core@9.0.0-next-9.44':
    resolution: {integrity: sha512-a}

  '@verdaccio/server@9.0.0-next-9.44':
    resolution: {integrity: sha512-b}

  '@verdaccio/test-helper@5.0.0-next-9.45':
    resolution: {integrity: sha512-c}

  verdaccio-htpasswd@14.0.0-next-9.41:
    resolution: {integrity: sha512-d}

  express@5.4.0:
    resolution: {integrity: sha512-e}

snapshots:

  '@verdaccio/core@9.0.0-next-9.44':
    dependencies:
      semver: 7.8.5

  '@verdaccio/server@9.0.0-next-9.44(supports-color@8.1.1)':
    dependencies:
      '@verdaccio/core': 9.0.0-next-9.44
      express: 5.4.0
    transitivePeerDependencies:
      - supports-color

  '@verdaccio/test-helper@5.0.0-next-9.45':
    dependencies:
      '@verdaccio/core': 9.0.0-next-9.44
`;

const changelog = `# @verdaccio/core

## 9.0.0-next-9.44

### Patch Changes

- Updated dependencies [7f75311]
  - @verdaccio/types@14.0.0-next-9.20

## 9.0.0-next-9.43

### Minor Changes

- aeaf4d8: Make \`npm audit signatures\` work through Verdaccio.

  Second paragraph with a snippet:

  \`\`\`yaml
  flags:
    signatures: true
  \`\`\`

### Patch Changes

- 1d1ba47: Fix HTTP 500 responses when minimatch 11 is forced.

## 9.0.0-next-9.42

No changes in this release.

## 9.0.0-next-9.41

### Major Changes

- 0000001: Drop something old.
`;

describe('dependency-update-changeset', () => {
  test('bumpedPackages lists verdaccio packages whose lockfile version grew', () => {
    expect(bumpedPackages(baseLock, headLock)).toEqual([
      { name: '@verdaccio/core', from: '9.0.0-next-9.41', to: '9.0.0-next-9.44' },
      { name: '@verdaccio/server', from: '9.0.0-next-9.41', to: '9.0.0-next-9.44' },
      { name: '@verdaccio/test-helper', from: '5.0.0-next-9.42', to: '5.0.0-next-9.45' },
    ]);
  });

  test('runtimePackages follows the snapshots from the runtime dependencies only', () => {
    const runtime = runtimePackages(headLock, ['@verdaccio/server', 'express']);
    expect([...runtime].sort()).toEqual(['@verdaccio/core', '@verdaccio/server']);
  });

  test('parseChangelog keeps authored entries with their level and body', () => {
    const releases = parseChangelog(changelog);
    expect(releases.map((release) => release.version)).toEqual([
      '9.0.0-next-9.44',
      '9.0.0-next-9.43',
      '9.0.0-next-9.42',
      '9.0.0-next-9.41',
    ]);
    expect(releases[0].entries).toEqual([]);
    expect(releases[2].entries).toEqual([]);
    expect(releases[1].entries).toEqual([
      {
        level: 'minor',
        hash: 'aeaf4d8',
        text: 'Make `npm audit signatures` work through Verdaccio.\n\nSecond paragraph with a snippet:\n\n```yaml\nflags:\n  signatures: true\n```',
      },
      {
        level: 'patch',
        hash: '1d1ba47',
        text: 'Fix HTTP 500 responses when minimatch 11 is forced.',
      },
    ]);
  });

  test('entriesBetween takes the releases after the old version up to the new one', () => {
    const releases = parseChangelog(changelog);
    const hashes = (from: string, to: string) =>
      entriesBetween(releases, from, to).map((entry) => entry.hash);
    expect(hashes('9.0.0-next-9.41', '9.0.0-next-9.44')).toEqual(['aeaf4d8', '1d1ba47']);
    expect(hashes('9.0.0-next-9.43', '9.0.0-next-9.44')).toEqual([]);
    expect(hashes('9.0.0-next-9.40', '9.0.0-next-9.41')).toEqual(['0000001']);
  });

  test('mergeEntries dedupes a changeset shared by several packages and keeps the highest level', () => {
    const merged = mergeEntries([
      { name: '@verdaccio/store', entries: [{ level: 'patch', hash: 'abc1234', text: 'Shared.' }] },
      { name: '@verdaccio/api', entries: [{ level: 'minor', hash: 'abc1234', text: 'Shared.' }] },
      { name: '@verdaccio/api', entries: [{ level: 'patch', hash: 'def5678', text: 'Only api.' }] },
    ]);
    expect(merged.map((entry) => [entry.hash, entry.level, [...entry.packages]])).toEqual([
      ['abc1234', 'minor', ['@verdaccio/store', '@verdaccio/api']],
      ['def5678', 'patch', ['@verdaccio/api']],
    ]);
    expect(highestLevel(merged)).toBe('minor');
    expect(highestLevel([])).toBe('patch');
  });

  test('renderChangeset groups entries by level with the package list and the PR link', () => {
    const entries = mergeEntries([
      {
        name: '@verdaccio/core',
        entries: [{ level: 'minor', hash: 'aeaf4d8', text: 'Add signatures.\n\nMore detail.' }],
      },
      { name: '@verdaccio/api', entries: [{ level: 'patch', hash: '1d1ba47', text: 'Fix 500.' }] },
    ]);
    entries[0].pr = '6450';
    expect(renderChangeset({ distTag: 'next-9', entries, bump: 'minor' })).toBe(
      [
        '---',
        "'verdaccio': minor",
        '---',
        '',
        'Update the `@verdaccio/*` modules to the `next-9` npm dist-tag.',
        '',
        '**Minor changes**',
        '',
        '- `@verdaccio/core`: Add signatures. ([#6450](https://github.com/verdaccio/verdaccio/pull/6450))',
        '',
        '  More detail.',
        '',
        '**Patch changes**',
        '',
        '- `@verdaccio/api`: Fix 500. (`1d1ba47`)',
        '',
      ].join('\n')
    );
  });

  test('renderChangeset explains a bump without authored entries', () => {
    expect(renderChangeset({ distTag: 'next-9', entries: [], bump: 'patch' })).toContain(
      'The bumped versions carry no changelog entries of their own.'
    );
  });
});
