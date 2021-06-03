const url = process.env.METRICS_URL;
const token = process.env.METRICS_TOKEN;
const version = process.env.METRICS_VERSION;
const benchmark = process.env.METRICS_BENCHMARK;

if (!url || !token || !version || !benchmark) {
  throw Error('missing params');
}

const fs = require('fs');
const path = require('path');
const debug = require('debug')('metrics');
const nodeFetch = require('node-fetch');
const fileMetrics = `hyper-results-${version}-${benchmark}.json`;
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
      'x-metrics-version': version,
      'x-metrics-benchmark': benchmark,
    },
  })
    .then((res) => res.text()) // expecting a json response
    .then((json) => {
      debug('response %o', json);
    });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('error on process metrics', error);
}
