// eslint-disable-next-line jest/no-mocks-import
import { generateTokenWithTimeRange } from '../../../jest/unit/components/__mocks__/token';

describe('getDefaultUserState', (): void => {
  const username = 'xyz';

  beforeEach(() => {
    jest.resetModules();
  });

  test('should return state with empty user', (): void => {
    const token = 'token-xx-xx-xx';

    jest.doMock('../storage', () => ({
      getItem: (key: string) => (key === 'token' ? token : username),
    }));
    const { getDefaultUserState } = require('./login');
    const result = {
      token: null,
      username: null,
    };
    expect(getDefaultUserState()).toEqual(result);
  });

  test('should return state with user from storage', (): void => {
    const token = generateTokenWithTimeRange(24);

    jest.doMock('../storage', () => ({
      getItem: (key: string) => (key === 'token' ? token : username),
    }));
    const { getDefaultUserState } = require('./login');
    const result = {
      token,
      username,
    };
    expect(getDefaultUserState()).toEqual(result);
  });
});
