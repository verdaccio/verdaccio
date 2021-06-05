/* eslint-disable no-console */
import { writeFileSync } from 'fs';

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
  const result = await autocannon({
    url: getURL(benchmark),
    connections: 10,
    pipelining: 1,
    duration: 10,
  });
  const wrapResults = {
    results: [result],
  };
  writeFileSync(
    `./api-results-${version}-${benchmark}.json`,
    JSON.stringify(wrapResults, null, 2),
    'utf-8'
  );
}
