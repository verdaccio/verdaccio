import fetch, { RequestInit, Response } from 'node-fetch';

import { logger } from '@verdaccio/logger';

export async function notifyRequest(url: string, options: RequestInit, content): Promise<any | Error> {
    const response: Response = await fetch(url, options);
    const jsonResponse = await response.json();

    if (response.ok) {
      logger.info({ content }, 'A notification has been shipped: @{content}');
      return jsonResponse;
    } else {
      logger.error({ message: jsonResponse }, 'notify service has thrown an error: @{message}');
      throw new Error(jsonResponse);
    }
}
