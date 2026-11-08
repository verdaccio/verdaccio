// Collects every package's vitest coverage report into coverage/site, with an index page.
// Expects `pnpm test -- --coverage --coverage.reporter=html --coverage.reporter=json-summary`
// to have run first, so each package has coverage/index.html and coverage/coverage-summary.json.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'coverage', 'site');
const metrics = ['lines', 'statements', 'functions', 'branches'];

function findReports(dir, depth = 0) {
  const reports = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'node_modules') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.name === 'coverage' && fs.existsSync(path.join(full, 'coverage-summary.json'))) {
      reports.push(full);
    } else if (depth < 3) {
      reports.push(...findReports(full, depth + 1));
    }
  }
  return reports;
}

function pct(covered, total) {
  return total === 0 ? 100 : (covered / total) * 100;
}

function grade(value) {
  return value >= 80 ? 'high' : value >= 50 ? 'medium' : 'low';
}

const escapeHtml = (text) =>
  String(text).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const packages = findReports(path.join(root, 'packages'))
  .map((dir) => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, '..', 'package.json'), 'utf8'));
    const summary = JSON.parse(fs.readFileSync(path.join(dir, 'coverage-summary.json'), 'utf8'));
    const slug = pkg.name.replace(/^@/, '').replace(/\//g, '-');
    fs.cpSync(dir, path.join(outDir, slug), { recursive: true });
    return { name: pkg.name, slug, total: summary.total };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

if (packages.length === 0) {
  console.error('no coverage reports found under packages/; run the tests with --coverage first');
  process.exit(1);
}

const totals = Object.fromEntries(
  metrics.map((metric) => [
    metric,
    packages.reduce(
      (sum, { total }) => ({
        covered: sum.covered + total[metric].covered,
        total: sum.total + total[metric].total,
      }),
      { covered: 0, total: 0 }
    ),
  ])
);

const cell = (value) => `<td class="${grade(value)}">${value.toFixed(2)}%</td>`;
const row = (label, total, href) =>
  `<tr><th>${href ? `<a href="${href}/">${escapeHtml(label)}</a>` : escapeHtml(label)}</th>` +
  metrics.map((metric) => cell(pct(total[metric].covered, total[metric].total))).join('') +
  '</tr>';

const sha = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'local';
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verdaccio coverage</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 2rem auto; max-width: 64rem; padding: 0 1rem; color: #1f2328; }
  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 0.4rem 0.75rem; border-bottom: 1px solid #d0d7de; text-align: right; }
  th:first-child { text-align: left; font-weight: 500; }
  thead th { font-weight: 600; }
  tfoot th, tfoot td { font-weight: 600; border-top: 2px solid #d0d7de; }
  .high { color: #1a7f37; } .medium { color: #9a6700; } .low { color: #cf222e; }
  p { color: #59636e; }
</style>
</head>
<body>
<h1>Verdaccio coverage</h1>
<p>master at ${escapeHtml(sha)}, ${new Date().toISOString().slice(0, 10)}. Each row links to the package report.</p>
<table>
<thead><tr><th>Package</th>${metrics.map((m) => `<th>${m}</th>`).join('')}</tr></thead>
<tbody>
${packages.map(({ name, slug, total }) => row(name, total, slug)).join('\n')}
</tbody>
<tfoot>${row('All packages', totals)}</tfoot>
</table>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log(
  `coverage site for ${packages.length} packages written to ${path.relative(root, outDir)}`
);
