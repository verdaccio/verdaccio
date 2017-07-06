import storage from './storage';
import axios from 'axios'

class API {
  constructor () {
    ['get', 'delete', 'post', 'put', 'patch'].map(method => {
      this[method] = (url, options = {}) => {
        if (!window.VERDACCIO_API_URL) {
          throw new Error('VERDACCIO_API_URL is not defined!');
        }

        const token = storage.getItem('token');
        if (token) {
          if (!options.headers) options.headers = {};

          options.headers.authorization = token;
        }

        if (!['http://', 'https://', '//'].some(prefix => url.startsWith(prefix))) {
          url = window.VERDACCIO_API_URL + url;
        }

        return axios.request({
          method,
          url,
          ...options
        });
      }
    })
  }
}


export default new API();
