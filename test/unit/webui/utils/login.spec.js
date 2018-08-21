import { makeLogin } from '../../../../src/webui/utils/login';

console.error = jest.fn();

jest.mock('.../../../../src/webui/utils/api', () => ({
  request: require('../components/__mocks__/api').default.request
}));

describe('makeLogin', () => {
  it('makeLogin - should give error for blank username and password', async () => {
    const result = {
      error: {
        description: "Username or password can't be empty!",
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
      error: {
        description: 'bad username/password, access denied',
        title: 'Unable to login',
        type: 'error'
      }
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
        description: "Username or password can't be empty!"
      }
    };

    const { username, password } = { username: '', password: '' };
    const login = await makeLogin(username, password);
    expect(login).toEqual(result);
  });
});
