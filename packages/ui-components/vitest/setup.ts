/**
 * Setup configuration for Vitest
 * This file includes global settings for the test environment.
 */
import '@testing-library/jest-dom/vitest';
import createDebugger from 'debug';
import 'mutationobserver-shim';
import { vi } from 'vitest';
import { Headers, Request, Response, fetch } from 'whatwg-fetch';

import { server } from './server';

const debug = createDebugger('verdaccio:ui-components:vitest-setup');

debug('Setting up Vitest environment for ui-components package.');

// Configure the test environment URL
Object.defineProperty(window, 'location', {
  writable: true,
  value: new URL('http://localhost:9000/'),
});

// Override the global fetch and related APIs
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// @ts-ignore : Property '__VERDACCIO_BASENAME_UI_OPTIONS' does not exist on type 'Global'.
global.__VERDACCIO_BASENAME_UI_OPTIONS = {
  base: 'http://localhost:9000/',
  protocol: 'http',
  host: 'localhost',
  primaryColor: '#4b5e40',
  url_prefix: '',
  darkMode: false,
  language: 'en-US',
  uri: 'http://localhost:9000/',
  pkgManagers: ['pnpm', 'yarn', 'npm'],
  title: 'Verdaccio Dev UI',
  scope: '',
  version: 'v1.0.0',
};

// mocking few DOM methods
// @ts-ignore : Property 'document' does not exist on type 'Global'.
if (global.document) {
  // @ts-ignore : Type 'Mock<{ selectNodeContents: () => void; }, []>' is not assignable to type '() => Range'.
  document.createRange = vi.fn((): void => ({
    selectNodeContents: (): void => {},
  }));
  document.execCommand = vi.fn();
}

beforeAll(() => {
  server.listen({
    // This will warn you in the console if a request doesn't match a mock
    onUnhandledRequest: 'warn',
  });

  server.events.on('request:start', ({ request }) => {
    debug('Outgoing:', request.method, request.url);
  });
  server.events.on('request:match', ({ request }) => {
    debug('Matched:', request.method, request.url);
  });
  server.events.on('request:unhandled', ({ request }) => {
    debug('Unhandled:', request.method, request.url);
  });
  server.events.on('response:mocked', ({ request, response }) => {
    debug('Mocked response for:', request.method, request.url, 'Status:', response.status);
  });
  server.events.on('response:bypass', ({ request }) => {
    debug('Bypassed request:', request.method, request.url);
  });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});
