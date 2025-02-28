// / <reference path="./testing-library.d.ts" />

/**
 * Setup configuration for Jest
 * This file includes global settings for the JEST environment.
 */
import '@testing-library/jest-dom';
import 'mutationobserver-shim';
import { vi } from 'vitest';
import { Headers, Request, Response, fetch } from 'whatwg-fetch';

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
