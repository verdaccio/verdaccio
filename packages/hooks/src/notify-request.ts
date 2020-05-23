import fetch, { RequestInit } from 'node-fetch';

import { logger } from '@verdaccio/logger';

export function notifyRequest(url: string, options: RequestInit, content): Promise<any | Error> {
  return new Promise(
    async (resolve, reject): Promise<any| Error> => {

      const response = await fetch(url, options);
      const jsonResponse = await response.json();

      if (response.ok) {
        logger.info({ content }, 'A notification has been shipped: @{content}');
        resolve(jsonResponse);
      } else {
        logger.error({ jsonResponse }, 'notify service has thrown an error: @{errorMessage}');
        reject(jsonResponse)
      }
    }
  );
}
