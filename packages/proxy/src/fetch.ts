import { default as nodeFetch } from 'node-fetch';
import fetchRetry from '@zeit/fetch-retry';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:proxy:fetch');

// example upstream
// {method: 'POST', body: stream}

export async function fetch(url) {
  const d = await fetchRetry(nodeFetch)(url, {
    retry: {
      retries: 3,
      factor: 2,
      minTimeout: 400,
      maxTimeout: 1000,
    },
    maxRetryAfter: 1,
    onRetry: () => {
      debug('retry %o', url);
    },
  });

  return d;
}
