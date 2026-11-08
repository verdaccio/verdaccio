#!/usr/bin/env node
// Writes the changeset of a `chore: update verdaccio 7.x dependencies` run from
// the CHANGELOG.md entries master published for every bumped verdaccio package.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import semver from 'semver';

const REPO_URL = 'https://github.com/verdaccio/verdaccio';
const LOCK_KEY = /^ {2}'?(@verdaccio\/[^@'/\s]+|verdaccio(?:-[^@'\s]+)?)@([^'(:\s]+)'?:/;
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

export function lockfileVersions(lockfile) {
  const versions = new Map();
  for (const line of lockfile.split('\n')) {
    const match = LOCK_KEY.exec(line);
    if (!match || !semver.valid(match[2])) continue;
    const [, name, version] = match;
    const current = versions.get(name);
    if (!current || semver.gt(version, current)) versions.set(name, version);
  }
  return versions;
}

export function bumpedPackages(baseLockfile, headLockfile) {
  const base = lockfileVersions(baseLockfile);
  const head = lockfileVersions(headLockfile);
  const bumps = [];
  for (const [name, to] of head) {
    const from = base.get(name);
    if (from && semver.gt(to, from)) bumps.push({ name, from, to });
  }
  return bumps.sort((a, b) => a.name.localeCompare(b.name));
}

// Verdaccio packages the binary ships: the runtime closure of `dependencies`
// through the lockfile snapshots, so dev-only packages do not reach the changelog.
export function runtimePackages(lockfile, rootDependencies) {
  const edges = new Map();
  let node;
  let inDependencies = false;
  for (const line of lockfile.split('\n')) {
    const key = /^ {2}'?([^'(:\s]+)@[^'(:\s]+(?:\([^)]*\))*'?:$/.exec(line);
    if (key) {
      node = key[1];
      inDependencies = false;
      continue;
    }
    if (/^ {4}\S/.test(line)) {
      inDependencies = /^ {4}(optionalD|d)ependencies:$/.test(line);
      continue;
    }
    const dependency = inDependencies && /^ {6}'?([^':\s]+)'?: /.exec(line);
    if (!node || !dependency) continue;
    if (!edges.has(node)) edges.set(node, new Set());
    edges.get(node).add(dependency[1]);
  }
  const reached = new Set();
  const queue = rootDependencies.filter((name) => LOCK_KEY.test(`  ${name}@0.0.0:`));
  while (queue.length > 0) {
    const name = queue.shift();
    if (reached.has(name)) continue;
    reached.add(name);
    for (const next of edges.get(name) ?? []) {
      if (LOCK_KEY.test(`  ${next}@0.0.0:`)) queue.push(next);
    }
  }
  return reached;
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

export function highestLevel(entries) {
  return entries.reduce(
    (level, entry) => (LEVELS[entry.level] > LEVELS[level] ? entry.level : level),
    'patch'
  );
}

export function renderChangeset({ distTag, entries, bump }) {
  const lines = ['---', `'verdaccio': ${bump}`, '---', ''];
  lines.push(`Update the \`@verdaccio/*\` modules to the \`${distTag}\` npm dist-tag.`);
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

function masterPackageDirs(masterRef) {
  const dirs = new Map();
  const paths = git(['ls-tree', '-r', '--name-only', masterRef, '--', 'packages'])
    .split('\n')
    .filter((path) => path.endsWith('/package.json') && !path.includes('/node_modules/'));
  for (const path of paths) {
    try {
      const { name } = JSON.parse(gitShow(masterRef, path));
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

export function buildChangeset({ base, head, master, distTag, allowMajor }) {
  const read = (path) => (head === 'worktree' ? readFileSync(path, 'utf8') : gitShow(head, path));
  const headLock = read('pnpm-lock.yaml');
  const runtime = runtimePackages(
    headLock,
    Object.keys(JSON.parse(read('package.json')).dependencies ?? {})
  );
  const bumps = bumpedPackages(gitShow(base, 'pnpm-lock.yaml'), headLock);
  const dirs = masterPackageDirs(master);
  const perPackage = [];
  for (const bump of bumps) {
    const dir = dirs.get(bump.name);
    if (!runtime.has(bump.name)) {
      console.error(`skip ${bump.name} ${bump.from} -> ${bump.to}: not a runtime dependency`);
      continue;
    }
    if (!dir) {
      console.error(`skip ${bump.name} ${bump.from} -> ${bump.to}: not developed on ${master}`);
      continue;
    }
    let changelog;
    try {
      changelog = gitShow(master, `${dir}/CHANGELOG.md`);
    } catch {
      console.error(`skip ${bump.name}: no CHANGELOG.md under ${dir}`);
      continue;
    }
    const entries = entriesBetween(parseChangelog(changelog), bump.from, bump.to);
    console.error(`${bump.name} ${bump.from} -> ${bump.to}: ${entries.length} entries`);
    perPackage.push({ name: bump.name, entries });
  }
  const entries = mergeEntries(perPackage);
  for (const entry of entries) entry.pr = pullRequestOf(entry.hash);
  const bump = highestLevel(entries);
  if (bump === 'major' && !allowMajor) {
    const breaking = entries
      .filter((entry) => entry.level === 'major')
      .map((entry) => `  ${entry.hash} ${entry.text.split('\n')[0]}`);
    throw new Error(
      `the bump carries breaking changes; rerun with --allow-major to publish a major:\n${breaking.join('\n')}`
    );
  }
  return { bump, changeset: renderChangeset({ distTag, entries, bump }) };
}

function main() {
  const { values } = parseArgs({
    options: {
      base: { type: 'string', default: 'HEAD' },
      head: { type: 'string', default: 'worktree' },
      master: { type: 'string', default: 'origin/master' },
      'dist-tag': { type: 'string', default: 'next-9' },
      out: { type: 'string' },
      'allow-major': { type: 'boolean', default: false },
    },
  });
  const { bump, changeset } = buildChangeset({
    base: values.base,
    head: values.head,
    master: values.master,
    distTag: values['dist-tag'],
    allowMajor: values['allow-major'],
  });
  if (values.out) {
    writeFileSync(values.out, changeset);
    console.log(bump);
  } else {
    process.stdout.write(changeset);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
