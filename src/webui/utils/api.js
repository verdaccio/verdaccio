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

      /**
       * Handles response according to content type
       * @param {object} response
       * @returns {promise}
       */
      function handleResponseType(response) {
        if (response.headers) {
          const contentType = response.headers.get('Content-Type');
          if (contentType.includes('application/pdf')) {
            return Promise.all([response.ok, response.blob()]);
          }
          if (contentType.includes('application/json')) {
            return Promise.all([response.ok, response.json()]);
          }
          // it includes all text types
          if (contentType.includes('text/')) {
            return Promise.all([response.ok, response.text()]);
          }
        }
      }

      return new Promise((resolve, reject) => {
        fetch(url, {
          method,
          credentials: 'same-origin',
          ...options
        })
        .then(handleResponseType)
        .then(([responseOk, body]) => {
          if (responseOk) {
            resolve(body);
          } else {
            reject(body);
          }
        });
      });
    }
}

export default new API();
