/**
 * CI - Script used on automation GitHub Actions to
 * submit metrics to a third party database.
 */
const url = process.env.METRICS_URL;
const token = process.env.METRICS_TOKEN;
const version = process.env.METRICS_VERSION;
const benchmark = process.env.METRICS_BENCHMARK;
const source = process.env.METRICS_SOURCE;
const commit = process.env.METRICS_COMMIT_HASH;
const file = process.env.METRICS_FILE_NAME ?? 'hyper-results';

if (!url || !token || !version || !benchmark || !commit || !file) {
  throw new TypeError('required missing params, check parameters are available');
}

const fs = require('fs');
const path = require('path');
const debug = require('debug')('metrics');
const nodeFetch = require('node-fetch');
const fileMetrics = `${file}-${version}-${benchmark}.json`;
// file should be avilable on the root of the project
const filePath = path.join(__dirname, '../', fileMetrics);
debug('file path %o', filePath);

try {
  const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  debug('body %o', fileContent.results[0]);
  nodeFetch(url, {
    method: 'POST',
    body: JSON.stringify(fileContent.results[0]),
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'x-metrics-version': version,
      'x-metrics-source': source,
      'x-metrics-benchmark': benchmark,
      'x-metrics-commit-hash': commit,
    },
  })
    .then((res: any) => res.text()) // expecting a json response
    .then((json: any) => {
      debug('response %o', json);
    });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('error on process metrics', error);
  process.exit(1);
}
