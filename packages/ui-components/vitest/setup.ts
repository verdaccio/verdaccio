// / <reference path="./testing-library.d.ts" />
/**
 * Setup configuration for Jest
 * This file includes global settings for the JEST environment.
 */
import '@testing-library/jest-dom';
import createDebugger from 'debug';
import { setupServer } from 'msw/node';
import 'mutationobserver-shim';
import { vi } from 'vitest';
import { Headers, Request, Response, fetch } from 'whatwg-fetch';

import * as mockHandlers from './msw-utils';

const debug = createDebugger('verdaccio:ui-components:vitest-setup');

debug('Setting up Vitest environment for ui-components package.');

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

/**
 * Setting up MSW server with predefined handlers for testing.
 * The server will intercept network requests and return mock responses based on the handlers defined in msw-utils.ts.
 * This allows for consistent and controlled testing of components that rely on API interactions without making actual network requests.
 */

const handlers = [
  mockHandlers.mockLogin(),
  mockHandlers.mockHomePackages(),
  mockHandlers.mockSearch(),
  mockHandlers.mockHomePackages(),
  mockHandlers.mockSidebar('storybook'),
  mockHandlers.mockSidebar('jquery'),
  mockHandlers.mockSidebar('glob'),
  mockHandlers.mockReadme('storybook'),
  mockHandlers.mockReadme('jquery'),
  mockHandlers.mockReadme('glob'),
  mockHandlers.mockResetPassword(),
  mockHandlers.mockCliLogin(),
  mockHandlers.mockAddUser(),
  mockHandlers.mockTarball(),
  // To handle errors
  mockHandlers.mockSidebar('JSONStream', null, 401),
  mockHandlers.mockSidebar('kleur', null, 404),
];
const server = setupServer(...handlers);

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
