
import {isTokenExpire, makeLogin} from '../../../../src/webui/utils/login';

import {
  generateTokenWithTimeRange,
  generateTokenWithExpirationAsString,
  generateTokenWithOutExpiration
} from '../components/__mocks__/token';


console.error = jest.fn();

jest.mock('.../../../../src/webui/utils/api', () => ({
  request: require('../components/__mocks__/api').default.request
}));

describe('isTokenExpire', () => {
  it('isTokenExpire - token is not present', () => {
    expect(isTokenExpire()).toBeTruthy();
  });

  it('isTokenExpire - token is not a valid payload', () => {
    expect(isTokenExpire('not_a_valid_token')).toBeTruthy();
  });

  it('isTokenExpire - token should not expire in 24 hrs range', () => {
    const token = generateTokenWithTimeRange(24);
    expect(isTokenExpire(token)).toBeFalsy();
  });

  it('isTokenExpire - token should expire for current time', () => {
    const token = generateTokenWithTimeRange();
    expect(isTokenExpire(token)).toBeTruthy();
  });

  it('isTokenExpire - token expiration is not available', () => {
    const token = generateTokenWithOutExpiration();
    expect(isTokenExpire(token)).toBeTruthy();
  });

  it('isTokenExpire - token is not a valid json token', () => {
    const token = generateTokenWithExpirationAsString();
    const result = [
      'Invalid token:',
      SyntaxError('Unexpected token o in JSON at position 1'),
      'xxxxxx.W29iamVjdCBPYmplY3Rd.xxxxxx'
    ];
    expect(isTokenExpire(token)).toBeTruthy();
    expect(console.error).toBeCalledWith(...result);
  });
});

describe('makeLogin', () => {
  it('makeLogin - should give error for blank username and password', async () => {
    const result = {
      error: {
        description: 'Something went wrong.',
        title: 'Unable to login',
        type: 'error'
      }
    };
    const login = await makeLogin();
    expect(login).toEqual(result);
  });

  it('makeLogin - should login successfully', async () => {
    const { username, password } = { username: 'sam', password: '1234' };
    const result = { token: 'TEST_TOKEN', username: 'sam' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });

  it('makeLogin - login should failed with 401', async () => {
    const result = {
      error: { description: 'bad username/password, access denied', 
      title: 'Unable to login', 
      type: 'error'}
    };

    const { username, password } = { username: 'sam', password: '123456' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });

  it('makeLogin - login should failed with when no data is sent', async () => {
    const result = {
      error: {
        title: 'Unable to login',
        type: 'error',
        description: 'Username or password can\'t be empty!'
      }
    };

    const { username, password } = { username: '', password: '' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });
});
