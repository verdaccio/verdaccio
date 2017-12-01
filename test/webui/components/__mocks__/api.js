/**
 * API Mocks for WebUI
 */
import logo from '../store/logo';
import login from '../store/login';

/**
 * Register mock api endpoints
 * @param {string} endpoint
 * @returns {Promise}
 */
const register = (method = 'get', endpoint, config = {}) => {

  if (endpoint === 'login' && method === 'post') {
    return login(config);
  }

  if (endpoint === 'logo' && method === 'get') {
    return logo();
  }

  return Promise.reject({ status: 404, data: 'Not found' });
};

/**
 * Bind API methods
 */
const API = ['get', 'post'].reduce((api, method) => {
  api[method] = register.bind(null, method);
  return api;
}, {});

export default API;
