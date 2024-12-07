import { vi } from 'vitest';

// import { generateTokenWithTimeRange } from '../../../jest/unit/components/__mocks__/token';

describe('getDefaultUserState', (): void => {
  const username = 'xyz';

  beforeEach(() => {
    vi.resetModules();
  });

  test('should return state with empty user', async () => {
    const token = 'token-xx-xx-xx';
    vi.doMock('../storage', async (importOriginal) => ({
      ...(await importOriginal<typeof import('../storage')>()),
      getItem: (key: string) => (key === 'token' ? token : username),
    }));
    const Login = await import('./login');
    const { getDefaultUserState } = Login;
    const result = {
      token: null,
      username: null,
    };
    expect(getDefaultUserState()).toEqual(result);
  });

  // test('should return state with user from storage', async () => {
  //   const token = generateTokenWithTimeRange(24);
  //
  //   vi.doMock('../storage', async (importOriginal) => ({
  //     ...(await importOriginal<typeof import('../storage')>()),
  //     getItem: (key: string) => (key === 'token' ? token : username),
  //   }));
  //   const Login = await import('./login');
  //   const { getDefaultUserState } = Login;
  //   const result = {
  //     token,
  //     username,
  //   };
  //   expect(getDefaultUserState()).toEqual(result);
  // });
});
