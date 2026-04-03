import storage from './storage';

export class CustomError extends Error {
  code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'CustomError';
    this.code = code ?? 500;
  }
}

/**
 * Handles response according to content type
 * @param {object} response
 * @returns {promise}
 */
export function handleResponseType(response: Response): Promise<[boolean, any, number]> {
  if (response.headers) {
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/pdf')) {
      return Promise.all([response.ok, response.blob(), response.status]);
    }
    if (contentType?.includes('application/json')) {
      return Promise.all([response.ok, response.json(), response.status]);
    }
    // it includes all text types
    if (contentType?.includes('text/')) {
      return Promise.all([response.ok, response.text(), response.status]);
    }

    // unfortunately on download files there is no header available
    if (response.url && response.url.endsWith('.tgz') === true) {
      return Promise.all([response.ok, response.blob(), response.status]);
    }
  }

  // error handling
  return Promise.all([response.ok, response.text(), response.status]);
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
    }

    headers.set('x-client', 'verdaccio-ui');
    options.headers = headers;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        credentials: token ? 'include' : 'same-origin',
        signal: options.signal,
        ...options,
      })
        .then(handleResponseType)
        .then((response) => {
          const [ok, data, status] = response;
          if (ok === true) {
            resolve(data);
          } else {
            const message =
              typeof data === 'string' ? data : (data?.error ?? data?.message ?? 'Unknown error');
            reject(new CustomError(message, status));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new API();
