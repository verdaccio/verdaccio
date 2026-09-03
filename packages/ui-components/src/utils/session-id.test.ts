import { generateSessionId } from './session-id';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const originalRandomUUID = crypto.randomUUID;

const hideRandomUUID = () => {
  // plain-http deployments: crypto exists but randomUUID does not
  Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
};

describe('generateSessionId', () => {
  afterEach(() => {
    Object.defineProperty(crypto, 'randomUUID', {
      value: originalRandomUUID,
      configurable: true,
    });
  });

  test('should produce a 36-char uuid via crypto.randomUUID when available', () => {
    const id = generateSessionId();
    expect(id).toHaveLength(36);
    expect(id).toMatch(UUID_V4);
  });

  test('should fall back to getRandomValues outside secure contexts', () => {
    hideRandomUUID();
    const id = generateSessionId();
    expect(id).toHaveLength(36);
    expect(id).toMatch(UUID_V4);
  });

  test('fallback ids should not repeat', () => {
    hideRandomUUID();
    const ids = new Set(Array.from({ length: 100 }, () => generateSessionId()));
    expect(ids.size).toBe(100);
  });
});
