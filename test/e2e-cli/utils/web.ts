import { IncomingMessage } from 'http';
import request from 'request';

export function callRegistry(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let options = {
      url: url,
      headers: { Accept: 'application/json' }
    };
    // @ts-ignore
    request(options, (error: any, response: IncomingMessage, body: string) => {
      if (error) {
        reject(error);
        // @ts-ignore
      } else if (response.statusCode >= 400) {
        reject(new Error(`Requesting "${url}" returned status code ${response.statusCode}.`));
      } else {
        resolve(body);
      }
    });
  });
}
