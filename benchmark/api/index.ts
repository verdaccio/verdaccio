/* eslint-disable no-console */
import fs from 'fs';
import autocannon from 'autocannon';

async function foo() {
  const result = await autocannon({
    url: 'http://localhost:8000/react',
    connections: 10,
    pipelining: 1,
    duration: 10,
  });
  fs.writeFileSync('./api-results.json', JSON.stringify(result, null, 2), 'utf-8');
}

(async () => {
  await foo();
})();
