/* eslint-disable no-console */
import { writeFileSync } from 'fs';
import autocannon from 'autocannon';

export default async function run(url) {
  const result = await autocannon({
    url,
    connections: 10,
    pipelining: 1,
    duration: 10,
  });
  writeFileSync('./api-results.json', JSON.stringify(result, null, 2), 'utf-8');
}
