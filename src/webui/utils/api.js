import storage from './storage';

class API {
  request(url, method = 'GET', options = {}) {
      if (!window.VERDACCIO_API_URL) {
        throw new Error('VERDACCIO_API_URL is not defined!');
      }

      const token = storage.getItem('token');
      if (token) {
        if (!options.headers) options.headers = {};

        options.headers.authorization = token;
      }

      if (!['http://', 'https://', '//'].some((prefix) => url.startsWith(prefix))) {
        url = window.VERDACCIO_API_URL + url;
      }

      return fetch(url, {
        method,
        ...options
      });
    }
}

export default new API();
