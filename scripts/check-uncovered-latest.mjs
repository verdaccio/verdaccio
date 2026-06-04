#!/usr/bin/env node
// For each "uncovered" dependency listed in dependencies-report.json, fetch
// the latest version from the npm registry and compare it to the version(s)
// declared across the repo's package.json files.
//
// Usage:
//   node ./scripts/check-uncovered-latest.mjs [--input FILE] [--output FILE]
//                                             [--concurrency N] [--registry URL]
//                                             [--only-outdated]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const semver = require('semver');

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

const DEP_TYPES = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const DEFAULT_EXCLUDED = ['verdaccio'];

const COLOR_ENABLED = process.env.FORCE_COLOR
  ? process.env.FORCE_COLOR !== '0'
  : Boolean(process.stdout.isTTY) && !process.env.NO_COLOR && process.env.TERM !== 'dumb';
let useColor = COLOR_ENABLED;

const wrap = (open, close) => (s) => (useColor ? `\u001b[${open}m${s}\u001b[${close}m` : s);
const colors = {
  red: wrap(31, 39),
  orange: wrap('38;5;208', 39),
  yellow: wrap(33, 39),
  green: wrap(32, 39),
  dim: wrap(2, 22),
};

function colorDiff(diff, label = diff) {
  if (!diff || diff === '-') return label ?? '-';
  if (diff === 'major' || diff === 'premajor') return colors.red(label);
  if (diff === 'minor' || diff === 'preminor') return colors.orange(label);
  if (diff === 'patch' || diff === 'prepatch' || diff === 'prerelease') return colors.yellow(label);
  return label;
}

function colorStatus(status, label, diff = null) {
  if (status === 'up-to-date' || status === 'satisfies-latest') return colors.green(label);
  if (status === 'outdated') {
    // mirror the diff column color so severity is visible at a glance
    if (diff) return colorDiff(diff, label);
    return colors.red(label);
  }
  return label;
}

function parseArgs(argv) {
  const opts = {
    input: path.join(SCRIPT_DIR, 'dependencies-report.json'),
    output: path.join(SCRIPT_DIR, 'uncovered-latest-report.json'),
    concurrency: 8,
    registry: 'https://registry.npmjs.org',
    onlyOutdated: false,
    exclude: new Set(DEFAULT_EXCLUDED),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--input':
        opts.input = path.resolve(argv[++i]);
        break;
      case '--output':
        opts.output = path.resolve(argv[++i]);
        break;
      case '--concurrency':
        opts.concurrency = Math.max(1, Number(argv[++i]) || 1);
        break;
      case '--registry':
        opts.registry = String(argv[++i]).replace(/\/+$/, '');
        break;
      case '--only-outdated':
        opts.onlyOutdated = true;
        break;
      case '--exclude':
        for (const n of String(argv[++i]).split(',')) {
          const t = n.trim();
          if (t) opts.exclude.add(t);
        }
        break;
      case '--no-default-exclude':
        opts.exclude = new Set();
        break;
      case '--no-color':
        useColor = false;
        break;
      case '-h':
      case '--help':
        printUsage();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${a}`);
        printUsage();
        process.exit(1);
    }
  }
  return opts;
}

function printUsage() {
  console.log(
    [
      'Usage: node ./scripts/check-uncovered-latest.mjs [options]',
      '',
      'Options:',
      '  --input FILE        Path to dependencies-report.json',
      '  --output FILE       Path to write the comparison report',
      '  --concurrency N     Max parallel npm registry requests (default: 8)',
      '  --registry URL      npm registry URL (default: https://registry.npmjs.org)',
      '  --only-outdated     Print only outdated entries in the console table',
      `  --exclude LIST      Comma-separated dep names to skip (in addition to defaults: ${DEFAULT_EXCLUDED.join(', ')})`,
      '  --no-default-exclude  Do not apply the built-in default exclusions',
      '  --no-color          Disable ANSI colors (also honors NO_COLOR env)',
      '  -h, --help          Show this help',
    ].join('\n')
  );
}

function collectDeclaredVersions(report, depName) {
  const out = [];
  const unique = report.uniqueDependencies ?? {};
  for (const t of DEP_TYPES) {
    const entries = unique[t]?.[depName];
    if (!entries) continue;
    for (const { path: pkgPath, version } of entries) {
      out.push({ path: pkgPath, depType: t, version });
    }
  }
  return out;
}

async function fetchLatest(registry, name) {
  const url = `${registry}/${name.replace('/', '%2F')}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const latest = data?.['dist-tags']?.latest;
  if (!latest) throw new Error('no dist-tags.latest');
  return latest;
}

function classify(declaredVersion, latest) {
  if (!declaredVersion) return { status: 'unknown', diff: null };
  if (declaredVersion.startsWith('workspace:')) return { status: 'workspace', diff: null };
  if (/^(file|link|git\+|github:|https?:)/.test(declaredVersion)) {
    return { status: 'non-registry', diff: null };
  }

  const range = declaredVersion.replace(/^npm:/, '');
  let coerced;
  try {
    coerced = semver.minVersion(range);
  } catch {
    coerced = null;
  }
  if (!coerced) return { status: 'unparseable', diff: null };

  const diff = semver.diff(coerced.version, latest); // null when equal
  let status;
  if (semver.satisfies(latest, range, { includePrerelease: true })) {
    status = semver.eq(coerced, latest) ? 'up-to-date' : 'satisfies-latest';
  } else if (semver.gt(latest, coerced)) {
    status = 'outdated';
  } else if (semver.lt(latest, coerced)) {
    status = 'ahead-of-registry';
  } else {
    status = 'other';
  }
  return { status, diff };
}

// Pick the most severe diff across declared entries. null < prerelease < patch < minor < major
const DIFF_RANK = {
  major: 6,
  premajor: 5,
  minor: 4,
  preminor: 3,
  patch: 2,
  prepatch: 1,
  prerelease: 1,
};
function worstDiff(perEntry) {
  let worst = null;
  let worstRank = -1;
  for (const e of perEntry) {
    const rank = DIFF_RANK[e.diff] ?? 0;
    if (rank > worstRank) {
      worstRank = rank;
      worst = e.diff;
    }
  }
  return worst;
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        results[i] = await fn(items[i], i);
      } catch (err) {
        results[i] = { __error: err.message ?? String(err) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function statusBadge(status) {
  switch (status) {
    case 'outdated':
      return 'OUTDATED';
    case 'up-to-date':
      return 'OK';
    case 'satisfies-latest':
      return 'OK*';
    case 'workspace':
      return 'workspace';
    case 'ahead-of-registry':
      return 'AHEAD';
    case 'non-registry':
      return 'non-registry';
    case 'unparseable':
      return 'unparseable';
    default:
      return status;
  }
}

function printTable(rows, onlyOutdated) {
  const filtered = onlyOutdated ? rows.filter((r) => r.worstStatus === 'outdated') : rows;
  if (filtered.length === 0) {
    console.log('(no rows to display)');
    return;
  }
  const headers = ['name', 'declared', 'latest', 'diff', 'status', 'count'];
  // each cell is { raw, display } - raw is used for alignment, display can include ANSI codes
  const data = filtered.map((r) => {
    const diffRaw = r.diff ?? '-';
    const statusRaw = statusBadge(r.worstStatus);
    return [
      { raw: r.name, display: r.name },
      { raw: r.declaredSummary, display: r.declaredSummary },
      { raw: r.latest ?? '-', display: r.latest ?? '-' },
      { raw: diffRaw, display: colorDiff(diffRaw) },
      { raw: statusRaw, display: colorStatus(r.worstStatus, statusRaw, r.diff) },
      { raw: String(r.declared.length), display: String(r.declared.length) },
    ];
  });
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...data.map((row) => row[i].raw.length))
  );
  const fmtRow = (cells) =>
    cells.map((c, i) => c.display + ' '.repeat(widths[i] - c.raw.length)).join('  ');
  const fmtHeader = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
  console.log(fmtHeader(headers));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const row of data) console.log(fmtRow(row));
}

function summarizeDeclared(declared) {
  const versions = [...new Set(declared.map((d) => d.version))];
  if (versions.length <= 2) return versions.join(', ');
  return `${versions.slice(0, 2).join(', ')} (+${versions.length - 2} more)`;
}

function worstStatus(perEntry) {
  const order = [
    'outdated',
    'ahead-of-registry',
    'unparseable',
    'satisfies-latest',
    'up-to-date',
    'workspace',
    'non-registry',
    'unknown',
  ];
  for (const s of order) {
    if (perEntry.some((e) => e.status === s)) return s;
  }
  return 'unknown';
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  console.log(`Input:       ${opts.input}`);
  console.log(`Output:      ${opts.output}`);
  console.log(`Registry:    ${opts.registry}`);
  console.log(`Concurrency: ${opts.concurrency}`);

  if (!fs.existsSync(opts.input)) {
    console.error(`Error: input not found: ${opts.input}`);
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(opts.input, 'utf8'));
  const allUncovered = report.uncoveredDependencies ?? [];
  const excluded = allUncovered.filter((n) => opts.exclude.has(n));
  const uncovered = allUncovered.filter((n) => !opts.exclude.has(n));
  console.log(`Uncovered dependencies: ${allUncovered.length}`);
  if (excluded.length > 0) {
    console.log(`Excluded (${excluded.length}): ${excluded.join(', ')}`);
  }
  console.log(`To check: ${uncovered.length}`);

  const results = await mapWithConcurrency(uncovered, opts.concurrency, async (name) => {
    const declared = collectDeclaredVersions(report, name);
    let latest = null;
    let error = null;
    try {
      latest = await fetchLatest(opts.registry, name);
    } catch (err) {
      error = err.message ?? String(err);
    }
    const perEntry = declared.map((d) => {
      if (error) return { ...d, status: 'error', diff: null };
      const { status, diff } = classify(d.version, latest);
      return { ...d, status, diff };
    });
    return {
      name,
      latest,
      error,
      declared: perEntry,
      declaredSummary: summarizeDeclared(declared),
      worstStatus: error ? 'error' : worstStatus(perEntry),
      diff: error ? null : worstDiff(perEntry),
    };
  });

  const counts = results.reduce((acc, r) => {
    acc[r.worstStatus] = (acc[r.worstStatus] ?? 0) + 1;
    return acc;
  }, {});

  const diffCounts = results.reduce((acc, r) => {
    if (r.diff == null) return acc;
    acc[r.diff] = (acc[r.diff] ?? 0) + 1;
    return acc;
  }, {});

  const outReport = {
    generatedAt: new Date().toISOString(),
    inputReport: path.relative(DEFAULT_REPO_ROOT, opts.input).split(path.sep).join('/'),
    registry: opts.registry,
    excluded,
    totalChecked: results.length,
    counts,
    diffCounts,
    results,
  };
  fs.writeFileSync(opts.output, JSON.stringify(outReport, null, 2) + '\n', 'utf8');

  console.log('');
  printTable(results, opts.onlyOutdated);
  console.log('');
  console.log('Status summary');
  console.log('--------------');
  for (const [k, v] of Object.entries(counts).sort()) {
    const label = statusBadge(k);
    const padded = label.padEnd(16);
    console.log(`  ${colorStatus(k, padded)} ${v}`);
  }
  console.log('');
  console.log('Diff summary (declared min vs latest)');
  console.log('-------------------------------------');
  for (const [k, v] of Object.entries(diffCounts).sort()) {
    const padded = String(k).padEnd(16);
    console.log(`  ${colorDiff(k, padded)} ${v}`);
  }
  console.log('');
  console.log(`Report written to: ${opts.output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
