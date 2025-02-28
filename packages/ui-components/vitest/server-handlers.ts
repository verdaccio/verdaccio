import fs from 'fs';
import { HttpResponse, http } from 'msw';
import path from 'path';

export const handlers = [
  // Home
  http.get('http://localhost:9000/-/verdaccio/data/packages', () => {
    return HttpResponse.json(Array(400).fill(require('./api/home-packages.json')));
  }),

  // Search
  http.get('http://localhost:9000/-/verdaccio/data/search/*', () => {
    return HttpResponse.json(require('./api/search-verdaccio.json'));
  }),

  // Storybook
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/storybook', ({ params }) => {
    const { v } = params;
    if (v) {
      return HttpResponse.json(require('./api/storybook-v.json'));
    } else {
      return HttpResponse.json(require('./api/storybook-sidebar.json'));
    }
  }),
  http.get('http://localhost:9000/-/verdaccio/data/package/readme/storybook', () => {
    return HttpResponse.text(require('./api/storybook-readme')());
  }),

  // JQuery (with complete Readme)
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/jquery', () => {
    return HttpResponse.json(require('./api/jquery-sidebar.json'));
  }),
  http.get('http://localhost:9000/-/verdaccio/data/package/readme/jquery', () => {
    return HttpResponse.text(require('./api/jquery-readme')());
  }),

  // Sidebar Errors
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/JSONStream', () => {
    return new HttpResponse('unauthorized', { status: 401 });
  }),
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/semver', () => {
    return new HttpResponse('internal server error', { status: 500 });
  }),
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/kleur', () => {
    return new HttpResponse('not found', { status: 404 });
  }),

  // Glob
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/glob', () => {
    return HttpResponse.json(require('./api/glob-sidebar.json'));
  }),
  http.get('http://localhost:9000/-/verdaccio/data/package/readme/glob', () => {
    return HttpResponse.text('foo glob');
  }),

  // Got
  http.get('http://localhost:9000/-/verdaccio/data/sidebar/got', () => {
    return HttpResponse.json(require('./api/got-sidebar.json'));
  }),
  http.get('http://localhost:9000/-/verdaccio/data/package/readme/got', () => {
    return HttpResponse.text('foo got');
  }),

  // Tarball Download
  http.get('http://localhost:9000/verdaccio/-/verdaccio-1.0.0.tgz', () => {
    const fileName = path.resolve(__dirname, './api/verdaccio-1.0.0.tgz');
    const fileContent = fs.readFileSync(fileName);
    return new HttpResponse(fileContent, {
      status: 200,
      headers: { 'Content-Type': 'application/octet-stream' },
    });
  }),

  // Login
  http.post<{ username: string; password: string }, { token: string; username: string }>(
    'http://localhost:9000/-/verdaccio/sec/login',
    async ({ request }) => {
      const body = await request.json();
      if (body.username === 'fail') {
        return new HttpResponse('unauthorized', { status: 401 });
      }

      return HttpResponse.json({ username: body.username, token: 'valid token' });
    }
  ),
];
