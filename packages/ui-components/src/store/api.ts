import storage from './storage';

export class CustomError extends Error {
  // @ts-ignore
  code: number;
}

/**
 * Handles response according to content type
 * @param {object} response
 * @returns {promise}
 */
export function handleResponseType(response: Response): Promise<[boolean, any]> {
  if (response.headers) {
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/pdf')) {
      return Promise.all([response.ok, response.blob()]);
    }
    if (contentType?.includes('application/json')) {
      return Promise.all([response.ok, response.json()]);
    }
    // it includes all text types
    if (contentType?.includes('text/')) {
      return Promise.all([response.ok, response.text()]);
    }

    // unfortunately on download files there is no header available
    if (response.url && response.url.endsWith('.tgz') === true) {
      return Promise.all([response.ok, response.blob()]);
    }
  }

  // error handling
  return Promise.all([response.ok, response]);
}

const AuthHeader = 'Authorization';

class API {
  public request<T>(
    url: string,
    method = 'GET',
    options: RequestInit = { headers: {} }
  ): Promise<T> {
    const token = storage.getItem('token');
    const headers = new Headers(options.headers);

    if (token && headers.has(AuthHeader) === false) {
      headers.set(AuthHeader, `Bearer ${token}`);
      options.headers = headers;
    }

    headers.set('x-client', 'verdaccio-ui');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        credentials: 'same-origin',
        signal: options.signal,
        ...options,
      })
        .then(handleResponseType)
        .then((response) => {
          const [ok, data] = response;
          if (ok === true) {
            resolve(data);
          } else {
            const error = new CustomError(data?.statusText ?? 'Unknown error');
            error.code = data?.status ?? 500;
            reject(error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new API();
