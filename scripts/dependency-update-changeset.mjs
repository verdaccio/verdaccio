#!/usr/bin/env node
// Writes the changeset of a `chore: update verdaccio 6.x dependencies` run from
// the CHANGELOG.md entries of every bumped verdaccio package: @verdaccio/ui-theme
// is developed on master, the other modules on 8.x.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import semver from 'semver';

const REPO_URL = 'https://github.com/verdaccio/verdaccio';
const LEVELS = { major: 3, minor: 2, patch: 1 };
const HEADINGS = {
  major: 'Breaking changes',
  minor: 'Minor changes',
  patch: 'Patch changes',
};

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function gitShow(ref, path) {
  return git(['show', `${ref}:${path}`]);
}

const isVerdaccioPackage = (name) =>
  name.startsWith('@verdaccio/') || name.startsWith('verdaccio-') || name === 'verdaccio';

// Verdaccio packages of `dependencies` whose pinned version grew. The 6.x
// manifest pins exact versions, so the manifest diff is the bump list.
export function bumpedPackages(baseManifest, headManifest) {
  const base = baseManifest.dependencies ?? {};
  const head = headManifest.dependencies ?? {};
  const bumps = [];
  for (const [name, to] of Object.entries(head)) {
    const from = base[name];
    if (!isVerdaccioPackage(name) || !semver.valid(from) || !semver.valid(to)) continue;
    if (semver.gt(to, from)) bumps.push({ name, from, to });
  }
  return bumps.sort((a, b) => a.name.localeCompare(b.name));
}

// Entries of a changesets CHANGELOG.md grouped by version; dependency-only
// releases ("Updated dependencies", "No changes in this release.") yield none.
export function parseChangelog(changelog) {
  const releases = [];
  let release;
  let level;
  let entry;
  for (const rawLine of changelog.split('\n')) {
    const line = rawLine.trimEnd();
    const version = /^## (\S+)$/.exec(line);
    if (version) {
      release = { version: version[1], entries: [] };
      releases.push(release);
      level = entry = undefined;
      continue;
    }
    const heading = /^### (Major|Minor|Patch) Changes$/.exec(line);
    if (heading) {
      level = heading[1].toLowerCase();
      entry = undefined;
      continue;
    }
    if (!release || !level) continue;
    const start = /^- ([0-9a-f]{7,40}): (.*)$/.exec(line);
    if (start) {
      entry = { level, hash: start[1], lines: [start[2]] };
      release.entries.push(entry);
      continue;
    }
    if (line.startsWith('- ')) {
      entry = undefined;
      continue;
    }
    if (entry) entry.lines.push(line.replace(/^ {2}/, ''));
  }
  for (const { entries } of releases) {
    for (const item of entries) {
      item.text = item.lines.join('\n').trim();
      delete item.lines;
    }
  }
  return releases;
}

export function entriesBetween(releases, from, to) {
  return releases
    .filter(
      ({ version }) => semver.valid(version) && semver.gt(version, from) && semver.lte(version, to)
    )
    .flatMap(({ entries }) => entries);
}

// One row per changeset: the same entry lands in every package it touched.
export function mergeEntries(perPackage) {
  const merged = new Map();
  for (const { name, entries } of perPackage) {
    for (const entry of entries) {
      const row = merged.get(entry.hash) ?? { ...entry, packages: new Set() };
      if (LEVELS[entry.level] > LEVELS[row.level]) row.level = entry.level;
      row.packages.add(name);
      merged.set(entry.hash, row);
    }
  }
  return [...merged.values()].sort(
    (a, b) => LEVELS[b.level] - LEVELS[a.level] || a.hash.localeCompare(b.hash)
  );
}

// 6.x releases fixes and dependency bumps as patch; the source level stays in the headings.
export function renderChangeset({ bumps, entries }) {
  const lines = ['---', `'verdaccio': patch`, '---', ''];
  lines.push(
    'Update verdaccio dependencies to the `latest` npm dist-tag (`@verdaccio/ui-theme` tracks `next-9`):',
    ''
  );
  for (const { name, from, to } of bumps) lines.push(`- \`${name}\`: \`${from}\` → \`${to}\``);
  if (entries.length === 0) {
    lines.push('', 'The bumped versions carry no changelog entries of their own.');
    return lines.join('\n') + '\n';
  }
  for (const level of ['major', 'minor', 'patch']) {
    const rows = entries.filter((entry) => entry.level === level);
    if (rows.length === 0) continue;
    lines.push('', `**${HEADINGS[level]}**`, '');
    for (const row of rows) {
      const packages = [...row.packages]
        .sort()
        .map((name) => `\`${name}\``)
        .join(', ');
      const link = row.pr ? `[#${row.pr}](${REPO_URL}/pull/${row.pr})` : `\`${row.hash}\``;
      const [first, ...rest] = row.text.split('\n');
      lines.push(`- ${packages}: ${first} (${link})`);
      for (const line of rest) lines.push(line ? `  ${line}` : '');
    }
  }
  return lines.join('\n') + '\n';
}

function packageDirs(ref) {
  const dirs = new Map();
  const paths = git(['ls-tree', '-r', '--name-only', ref, '--', 'packages'])
    .split('\n')
    .filter((path) => path.endsWith('/package.json') && !path.includes('/node_modules/'));
  for (const path of paths) {
    try {
      const { name } = JSON.parse(gitShow(ref, path));
      if (name) dirs.set(name, path.slice(0, -'/package.json'.length));
    } catch {
      // Fixtures under packages/*/test are not publishable manifests.
    }
  }
  return dirs;
}

function pullRequestOf(hash) {
  try {
    const subject = git(['log', '-1', '--format=%s', hash]);
    return /\(#(\d+)\)\s*$/.exec(subject)?.[1];
  } catch {
    return undefined;
  }
}

export function buildChangeset({ base, head, modulesRef, uiRef }) {
  const headManifest = JSON.parse(
    head === 'worktree' ? readFileSync('package.json', 'utf8') : gitShow(head, 'package.json')
  );
  const bumps = bumpedPackages(JSON.parse(gitShow(base, 'package.json')), headManifest);
  const sources = new Map([
    [modulesRef, packageDirs(modulesRef)],
    [uiRef, packageDirs(uiRef)],
  ]);
  const perPackage = [];
  for (const bump of bumps) {
    const ref = bump.name === '@verdaccio/ui-theme' ? uiRef : modulesRef;
    const dir = sources.get(ref).get(bump.name);
    if (!dir) {
      console.error(`skip ${bump.name} ${bump.from} -> ${bump.to}: not developed on ${ref}`);
      continue;
    }
    let changelog;
    try {
      changelog = gitShow(ref, `${dir}/CHANGELOG.md`);
    } catch {
      console.error(`skip ${bump.name}: no CHANGELOG.md under ${dir} on ${ref}`);
      continue;
    }
    const entries = entriesBetween(parseChangelog(changelog), bump.from, bump.to);
    console.error(`${bump.name} ${bump.from} -> ${bump.to}: ${entries.length} entries`);
    perPackage.push({ name: bump.name, entries });
  }
  const entries = mergeEntries(perPackage);
  for (const entry of entries) entry.pr = pullRequestOf(entry.hash);
  return { bumps, changeset: renderChangeset({ bumps, entries }) };
}

function main() {
  const { values } = parseArgs({
    options: {
      base: { type: 'string', default: 'HEAD' },
      head: { type: 'string', default: 'worktree' },
      modules: { type: 'string', default: 'origin/8.x' },
      ui: { type: 'string', default: 'origin/master' },
      out: { type: 'string' },
    },
  });
  const { changeset } = buildChangeset({
    base: values.base,
    head: values.head,
    modulesRef: values.modules,
    uiRef: values.ui,
  });
  if (values.out) writeFileSync(values.out, changeset);
  else process.stdout.write(changeset);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
