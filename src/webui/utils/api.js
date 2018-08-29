import storage from './storage';
import {HTTP_STATUS} from '../../../src/lib/constants';

/**
 * CHECK FOR BASE API URL
 */
if (!window.VERDACCIO_API_URL) {
  throw new Error('VERDACCIO_API_URL is not defined!');
}
const BASE_URL = window.VERDACCIO_API_URL;

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
};

/**
 * checkAuthentication if 401 then clears storage
 */
function checkAuthentication(response) {
  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    storage.removeItem('token');
    storage.removeItem('username');
    alert('You\'ve been logged out from server');
    window.location.reload();
  }
  return response;
}

/**
 * API
 */
class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  request(resource = '', method = 'GET', options = {}) {
    let endpoint;
    
    // checks for token
    const token = storage.getItem('token');
    if (token) {
      if (!options.headers) {
        options.headers = {};
      }
      options.headers.authorization = `Bearer ${token}`;
    }

    // Checks if resource is already a URL
    const protocols = ['http://', 'https://', '//'];
    const isResource = protocols.some((prefix) => resource.startsWith(prefix));
    if (isResource === false) {
      endpoint = this.baseUrl + resource;
    }

    // Final Promise
    return new Promise(function APIPromise(resolve, reject){
      fetch(endpoint, {
        method,
        credentials: 'same-origin',
        ...options
      })
        .then(checkAuthentication)
        .then(handleResponseType)
        .then(([responseOk, body]) => {
          if (responseOk) {
            resolve(body);
          } else {
            reject(body);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}


/**
 * Always returns singleton API instance
 */
let APIInstance;
if (!APIInstance) {
  APIInstance = new API(BASE_URL);
}

export default APIInstance;


