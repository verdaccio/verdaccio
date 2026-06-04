#!/usr/bin/env node
// Collects all dependencies from every package.json in the repo (excluding node_modules and abappm)
// and checks which dependencies are NOT covered by any rule in renovate.json.
//
// Usage: node ./scripts/collect-dependencies.mjs [--repo-root DIR] [--output FILE]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_OUTPUT = path.join(SCRIPT_DIR, 'dependencies-report.json');

const DEP_TYPES = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const EXCLUDED_DIR_NAMES = new Set(['node_modules', 'docker-examples', '.git']);

function parseArgs(argv) {
  const opts = { repoRoot: DEFAULT_REPO_ROOT, output: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--repo-root':
        opts.repoRoot = path.resolve(argv[++i]);
        break;
      case '--output':
        opts.output = path.resolve(argv[++i]);
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
  if (!opts.output) {
    opts.output = DEFAULT_OUTPUT;
  }
  return opts;
}

function printUsage() {
  console.log(
    [
      'Usage: node ./scripts/collect-dependencies.mjs [--repo-root DIR] [--output FILE]',
      '',
      'Options:',
      '  --repo-root DIR   Repository root (default: parent of script dir)',
      '  --output FILE     Output JSON file (default: <script-dir>/dependencies-report.json)',
      '  -h, --help        Show this help',
    ].join('\n')
  );
}

function* walkPackageJsonFiles(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(entry.name)) continue;
      yield* walkPackageJsonFiles(full);
    } else if (entry.isFile() && entry.name === 'package.json') {
      yield full;
    }
  }
}

function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.\\+?^$(){}|[\]]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function findMatch(name, patternRegexes) {
  for (const { pattern, regex } of patternRegexes) {
    if (regex.test(name)) return pattern;
  }
  return null;
}

function main() {
  const { repoRoot, output } = parseArgs(process.argv.slice(2));
  console.log(`Repo root:   ${repoRoot}`);
  console.log(`Output file: ${output}`);

  const packages = [];
  const consolidated = Object.fromEntries(DEP_TYPES.map((t) => [t, new Map()]));
  let parseErrors = 0;

  const files = Array.from(walkPackageJsonFiles(repoRoot));
  for (const file of files) {
    const relPath = path.relative(repoRoot, file).split(path.sep).join('/');
    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      console.warn(`WARNING: Could not parse ${relPath}: ${err.message}`);
      parseErrors++;
      continue;
    }

    const entry = {
      path: relPath,
      name: json.name ?? null,
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
      optionalDependencies: [],
    };

    for (const t of DEP_TYPES) {
      const section = json[t];
      if (!section || typeof section !== 'object') continue;
      for (const [name, version] of Object.entries(section)) {
        const v = String(version);
        entry[t].push({ name, version: v });
        if (!consolidated[t].has(name)) consolidated[t].set(name, []);
        consolidated[t].get(name).push({ path: relPath, version: v });
      }
    }
    packages.push(entry);
  }

  console.log(`Found ${files.length} package.json files (excluding node_modules and abappm).`);
  if (parseErrors > 0) console.log(`Skipped ${parseErrors} unparseable file(s).`);

  const allDeps = new Set();
  for (const t of DEP_TYPES) for (const k of consolidated[t].keys()) allDeps.add(k);
  const sortedAllDeps = [...allDeps].sort();

  const renovatePath = path.join(repoRoot, 'renovate.json');
  if (!fs.existsSync(renovatePath)) {
    console.error(`Error: ${renovatePath} not found`);
    process.exit(1);
  }
  const renovate = JSON.parse(fs.readFileSync(renovatePath, 'utf8'));

  const patternSet = new Set();
  for (const p of renovate.ignoreDeps ?? []) patternSet.add(p);
  for (const rule of renovate.packageRules ?? []) {
    for (const p of rule.matchPackageNames ?? []) patternSet.add(p);
  }
  const patterns = [...patternSet].sort();
  const patternRegexes = patterns.map((p) => ({ pattern: p, regex: patternToRegex(p) }));
  console.log(`Renovate patterns collected: ${patterns.length}`);

  const covered = [];
  const uncovered = [];
  for (const dep of sortedAllDeps) {
    const match = findMatch(dep, patternRegexes);
    if (match) covered.push({ name: dep, matchedBy: match });
    else uncovered.push(dep);
  }

  const uniqueByType = {};
  for (const t of DEP_TYPES) {
    uniqueByType[t] = Object.fromEntries(
      [...consolidated[t].entries()].sort(([a], [b]) => a.localeCompare(b))
    );
  }

  const report = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    packageJsonCount: files.length,
    totalUniqueDeps: sortedAllDeps.length,
    renovatePatternsCount: patterns.length,
    uncoveredCount: uncovered.length,
    coveredCount: covered.length,
    uncoveredDependencies: uncovered,
    coveredDependencies: covered,
    renovatePatterns: patterns,
    uniqueDependencies: uniqueByType,
    packages,
  };

  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', 'utf8');

  console.log('');
  console.log(`Report written to: ${output}`);
  console.log('');
  console.log('Summary');
  console.log('-------');
  console.log(`Total unique deps:       ${sortedAllDeps.length}`);
  console.log(`Covered by renovate:     ${covered.length}`);
  console.log(`NOT covered by renovate: ${uncovered.length}`);
  if (uncovered.length > 0) {
    console.log('');
    console.log('Dependencies NOT listed in renovate.json:');
    for (const d of uncovered) console.log(`  - ${d}`);
  }
}

main();
