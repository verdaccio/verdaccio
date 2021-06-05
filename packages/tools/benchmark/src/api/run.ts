import { writeFileSync } from 'fs';

const path = require('path');
const debug = require('debug')('metrics:autocannon');
const autocannon = require('autocannon');

function getURL(benchmark) {
  switch (benchmark) {
    case 'info':
      return 'http://localhost:4873/jquery';
    case 'tarball':
      return 'http://localhost:4873/jquery/-/jquery-3.6.0.tgz';
    default:
      throw new TypeError('no benckmark supported');
  }
}

export default async function run(benchmark, version) {
  try {
    debug('api report start');
    debug('url', getURL(benchmark));
    const result = await autocannon({
      url: getURL(benchmark),
      connections: 10,
      pipelining: 1,
      duration: 10,
    });
    const wrapResults = {
      results: [result],
    };
    const reportPath = path.join(process.cwd(), `./api-results-${version}-${benchmark}.json`);
    debug('report path %o', reportPath);
    writeFileSync(reportPath, JSON.stringify(wrapResults, null, 2), 'utf-8');
    debug('report ends');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`error on process autocannon run`, err);
    process.exit(1);
  }
}
