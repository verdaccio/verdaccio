/**
 * API Mocks for WebUI
 */
import logo from '../store/logo';
import login from '../store/login';
import { packageMeta } from '../store/packageMeta';

/**
 * Register mock api endpoints
 * @param {string} endpoint
 * @returns {Promise}
 */
const register = (url, method = 'get', options = {}) => {

  if (url === 'login' && method.toLocaleLowerCase() === 'post') {
    return login(options);
  }

  if (url === 'logo' && method.toLocaleLowerCase() === 'get') {
    return logo();
  }

  if (url === 'sidebar/verdaccio' && method.toLocaleLowerCase() === 'get') {
    return new Promise(function(resolve) {
      resolve(packageMeta);
    });
  }

  throw Error('Not found');
};

/**
 * Bind API methods
 */
class API {
  request() {
    return register.call(null, ...arguments);
  }
}

export default new API;
