import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTarballDownload } from './use-data-mutation';

const requestMock = vi.fn();
vi.mock('../store/api', () => ({
  default: {
    request: (...args: unknown[]) => requestMock(...args),
  },
}));

describe('useTarballDownload', () => {
  beforeEach(() => {
    requestMock.mockReset();
    requestMock.mockResolvedValue(new Blob(['tgz']));
  });

  it('fetches the tarball link with a GET', async () => {
    const { result } = renderHook(() => useTarballDownload());
    await act(async () => {
      await result.current.download({ link: 'http://localhost:8000/pkg/-/pkg-1.0.0.tgz' });
    });

    const [url, method] = requestMock.mock.calls[0];
    expect(url).toBe('http://localhost:8000/pkg/-/pkg-1.0.0.tgz');
    expect(method).toBe('GET');
  });

  it("must not send credentials: 'include' (registry serves ACAO '*', which the browser rejects for credentialed cross-origin requests)", async () => {
    const { result } = renderHook(() => useTarballDownload());
    await act(async () => {
      await result.current.download({ link: 'http://localhost:8000/pkg/-/pkg-1.0.0.tgz' });
    });

    const options = requestMock.mock.calls[0][2] ?? {};
    expect(options.credentials).not.toBe('include');
  });
});
