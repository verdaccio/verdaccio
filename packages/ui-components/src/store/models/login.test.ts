import { vi } from 'vitest';

import { generateTokenWithTimeRange } from '../../utils/token-generate';

describe('getDefaultUserState', (): void => {
  const username = 'xyz';

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  test('should return state with empty user', async () => {
    const token = 'token-xx-xx-xx';

    vi.doMock('../storage', () => ({
      default: {
        getItem: (key: string) => (key === 'token' ? token : username),
      },
    }));

    const Login = await import('./login');
    const { getDefaultUserState } = Login;
    const result = {
      token: null,
      username: null,
    };
    expect(getDefaultUserState()).toEqual(result);
  });

  test('should return state with user from storage', async () => {
    const token = generateTokenWithTimeRange(24);

    vi.doMock('../storage', () => ({
      default: {
        getItem: (key: string) => (key === 'token' ? token : username),
      },
    }));

    const Login = await import('./login');
    const { getDefaultUserState } = Login;
    const result = {
      token,
      username,
    };
    expect(getDefaultUserState()).toEqual(result);
  });
});
