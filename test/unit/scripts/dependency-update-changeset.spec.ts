import { describe, expect, test } from 'vitest';

import {
  bumpedPackages,
  entriesBetween,
  mergeEntries,
  parseChangelog,
  renderChangeset,
  // @ts-expect-error plain ESM script without types
} from '../../../scripts/dependency-update-changeset.mjs';

const changelog = `# @verdaccio/core

## 8.4.0

No changes in this release.

## 8.3.3

### Minor Changes

- aeaf4d8: Make \`npm audit signatures\` work through Verdaccio.

  Second paragraph.

### Patch Changes

- 59595e9: Correct the input type of the password validator.

- Updated dependencies [7f75311]
  - @verdaccio/types@14.0.0

## 8.3.2

### Major Changes

- 0000001: Drop something old.
`;

describe('dependency-update-changeset', () => {
  test('bumpedPackages lists the verdaccio dependencies whose pinned version grew', () => {
    const base = {
      dependencies: {
        '@verdaccio/core': '8.3.3',
        '@verdaccio/ui-theme': '9.0.0-next-9.42',
        'verdaccio-htpasswd': '13.1.7',
        express: '4.0.0',
      },
    };
    const head = {
      dependencies: {
        '@verdaccio/core': '8.4.0',
        '@verdaccio/ui-theme': '9.0.0-next-9.45',
        'verdaccio-htpasswd': '13.1.7',
        express: '5.0.0',
      },
    };
    expect(bumpedPackages(base, head)).toEqual([
      { name: '@verdaccio/core', from: '8.3.3', to: '8.4.0' },
      { name: '@verdaccio/ui-theme', from: '9.0.0-next-9.42', to: '9.0.0-next-9.45' },
    ]);
  });

  test('parseChangelog keeps authored entries and skips dependency-only releases', () => {
    const releases = parseChangelog(changelog);
    expect(releases.map((release: { version: string }) => release.version)).toEqual([
      '8.4.0',
      '8.3.3',
      '8.3.2',
    ]);
    expect(releases[0].entries).toEqual([]);
    expect(releases[1].entries).toEqual([
      {
        level: 'minor',
        hash: 'aeaf4d8',
        text: 'Make `npm audit signatures` work through Verdaccio.\n\nSecond paragraph.',
      },
      {
        level: 'patch',
        hash: '59595e9',
        text: 'Correct the input type of the password validator.',
      },
    ]);
  });

  test('entriesBetween takes the releases after the old version up to the new one', () => {
    const releases = parseChangelog(changelog);
    const hashes = (from: string, to: string) =>
      entriesBetween(releases, from, to).map((entry: { hash: string }) => entry.hash);
    expect(hashes('8.3.2', '8.4.0')).toEqual(['aeaf4d8', '59595e9']);
    expect(hashes('8.3.3', '8.4.0')).toEqual([]);
  });

  test('mergeEntries dedupes a changeset shared by several packages and keeps the highest level', () => {
    const merged = mergeEntries([
      { name: '@verdaccio/a', entries: [{ level: 'patch', hash: 'abc1234', text: 'Shared.' }] },
      { name: '@verdaccio/b', entries: [{ level: 'minor', hash: 'abc1234', text: 'Shared.' }] },
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].level).toBe('minor');
    expect([...merged[0].packages]).toEqual(['@verdaccio/a', '@verdaccio/b']);
  });

  test('renderChangeset is always a patch and lists bumps and entries', () => {
    const entries = mergeEntries([
      {
        name: '@verdaccio/core',
        entries: [{ level: 'minor', hash: 'aeaf4d8', text: 'Add signatures.\n\nMore.' }],
      },
    ]);
    entries[0].pr = '6450';
    expect(
      renderChangeset({
        bumps: [{ name: '@verdaccio/core', from: '8.3.3', to: '8.4.0' }],
        entries,
      })
    ).toBe(
      [
        '---',
        "'verdaccio': patch",
        '---',
        '',
        'Update verdaccio dependencies to the `latest` npm dist-tag (`@verdaccio/ui-theme` tracks `next-9`):',
        '',
        '- `@verdaccio/core`: `8.3.3` → `8.4.0`',
        '',
        '**Minor changes**',
        '',
        '- `@verdaccio/core`: Add signatures. ([#6450](https://github.com/verdaccio/verdaccio/pull/6450))',
        '',
        '  More.',
        '',
      ].join('\n')
    );
  });

  test('renderChangeset explains a bump without authored entries', () => {
    expect(
      renderChangeset({
        bumps: [{ name: 'verdaccio-audit', from: '1.0.0', to: '1.0.1' }],
        entries: [],
      })
    ).toContain('The bumped versions carry no changelog entries of their own.');
  });
});
