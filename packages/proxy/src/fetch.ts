import { default as nodeFetch } from 'node-fetch';
import fetchRetry from '@zeit/fetch-retry';

const TARBALL_URL = 'https://registry.verdaccio.org/node-fetch/-/node-fetch-3.0.0-beta.1.tgz';
const METADATA = 'https://registry.verdaccio.org/node-fetch';

// example upstream
// {method: 'POST', body: stream}

export async function fetch(url = TARBALL_URL) {
  const d = await fetchRetry(nodeFetch)(url, {
    retry: {
      retries: 10,
      factor: 2,
      minTimeout: 400,
      maxTimeout: 1000,
    },
    maxRetryAfter: 1,
    onRetry: () => {
      console.log('retryyyy-------------->');
    },
  });

  return d;
}
