import type { Response } from 'express';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { HEADERS } from '@verdaccio/core';

import renderHTML from '../src/middlewares/web/utils/renderHTML';

vi.mock('../src/middlewares/web/utils/template', () => ({
  default: vi.fn(),
}));

const renderTemplate = (await import('../src/middlewares/web/utils/template'))
  .default as ReturnType<typeof vi.fn>;

const manifest = { 'main.js': '/static/main.js', 'vendors.js': '/static/vendors.js' };
const options = { base: 'http://domain.com/', title: 'verdaccio' } as any;

const makeRes = () =>
  ({
    setHeader: vi.fn(),
    send: vi.fn(),
  }) as unknown as Response;

beforeEach(() => {
  renderTemplate.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('renderHTML', () => {
  test('renders template and writes HTML response', () => {
    renderTemplate.mockReturnValue('<html>ok</html>');
    const res = makeRes();

    renderHTML({} as any, manifest, null, options, res);

    expect(renderTemplate).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', HEADERS.TEXT_HTML);
    expect(res.send).toHaveBeenCalledWith('<html>ok</html>');
  });

  test('wraps render failures in an Error with the original as cause', () => {
    const original = new Error('boom');
    renderTemplate.mockImplementation(() => {
      throw original;
    });
    const res = makeRes();
    // Use a unique options object so the LRU cache from prior tests does not satisfy this call.
    const freshOptions = { ...options, title: `err-${Date.now()}-${Math.random()}` } as any;

    let caught: any;
    try {
      renderHTML({} as any, manifest, null, freshOptions, res);
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(Error);
    expect(caught.message).toBe('theme could not be loaded');
    // Stack must not be duplicated into the message.
    expect(caught.message).not.toContain(original.stack);
    expect(caught.cause).toBe(original);
    expect(res.send).not.toHaveBeenCalled();
  });

  test('serves the cached template on a second call with the same options', () => {
    renderTemplate.mockReturnValue('<html>cached</html>');
    const sharedOptions = { ...options, title: `cache-${Date.now()}-${Math.random()}` } as any;
    const res1 = makeRes();
    const res2 = makeRes();

    renderHTML({} as any, manifest, null, sharedOptions, res1);
    renderHTML({} as any, manifest, null, sharedOptions, res2);

    expect(renderTemplate).toHaveBeenCalledTimes(1);
    expect(res2.send).toHaveBeenCalledWith('<html>cached</html>');
  });

  test('skips the cache when html_cache is false', () => {
    renderTemplate.mockReturnValue('<html>fresh</html>');
    const sharedOptions = { ...options, title: `nocache-${Date.now()}-${Math.random()}` } as any;
    const config = { web: { html_cache: false } } as any;

    renderHTML(config, manifest, null, sharedOptions, makeRes());
    renderHTML(config, manifest, null, sharedOptions, makeRes());

    expect(renderTemplate).toHaveBeenCalledTimes(2);
  });
});
