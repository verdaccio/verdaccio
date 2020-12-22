/**
 * API Mocks for WebUI
 */
import login from '../store/login';
import logo from '../store/logo';
import { packageInformation } from '../store/package';
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
    return new Promise(function (resolve) {
      resolve(packageMeta);
    });
  }

  if (url === 'packages' && method.toLocaleLowerCase() === 'get') {
    return new Promise(function (resolve) {
      resolve(packageInformation);
    });
  }

  throw Error(`URL not found: ${url}`);
};

/**
 * Bind API methods
 */
class API {
  public request(...rest) {
    return register.call(null, ...rest);
  }
}

export default new API();
