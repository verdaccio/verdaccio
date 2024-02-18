import { rest } from 'msw';

const packagesPayload = require('./api/home-packages.json');

export const handlers = [
  rest.get('http://localhost:9000/-/verdaccio/data/packages', (req, res, ctx) => {
    return res(ctx.json(Array(400).fill(packagesPayload)));
  }),

  rest.get('http://localhost:9000/-/verdaccio/data/sidebar/storybook', (req, res, ctx) => {
    const { v } = req.params;
    if (v) {
      return res(ctx.json(require('./api/storybook-v.json')));
    } else {
      return res(ctx.json(require('./api/storybook-sidebar.json')));
    }
  }),

  rest.get('http://localhost:9000/-/verdaccio/data/search/*', (req, res, ctx) => {
    return res(ctx.json(require('./api/search-verdaccio.json')));
  }),

  rest.get('http://localhost:9000/-/verdaccio/data/package/readme/storybook', (req, res, ctx) => {
    return res(
      ctx.text(`<h1 id="storybook-cli">Storybook CLI MSW.js</h1>
    <p>This is a wrapper for <a href="https://www.npmjs.com/package/@storybook/cli">https://www.npmjs.com/package/@storybook/cli</a></p>
    `)
    );
  }),

  rest.get('http://localhost:9000/-/verdaccio/data/sidebar/jquery', (req, res, ctx) => {
    return res(ctx.json(require('./api/jquery-sidebar.json')));
  }),
  rest.get('http://localhost:9000/-/verdaccio/data/sidebar/glob', (req, res, ctx) => {
    return res(ctx.json(require('./api/glob-sidebar.json')));
  }),
  rest.get('http://localhost:9000/-/verdaccio/data/package/readme/glob', (req, res, ctx) => {
    return res(ctx.text('foo glob'));
  }),
  rest.get('http://localhost:9000/-/verdaccio/data/sidebar/got', (req, res, ctx) => {
    return res(ctx.json(require('./api/got-sidebar.json')));
  }),
  rest.get('http://localhost:9000/-/verdaccio/data/package/readme/got', (req, res, ctx) => {
    return res(ctx.text('foo got'));
  }),
  rest.get('http://localhost:9000/-/verdaccio/data/package/readme/jquery', (req, res, ctx) => {
    return res(ctx.text(require('./api/jquery-readme')()));
  }),

  rest.post<{ username: string; password: string }, { token: string; username: string }>(
    'http://localhost:9000/-/verdaccio/sec/login',
    // @ts-ignore
    async (req, res, ctx) => {
      // @ts-ignore
      const body = await req.json();
      if (body.username === 'fail') {
        return ctx.status(401);
      }

      return res(
        ctx.json({
          username: body.username,
          token: 'valid token',
        })
      );
    }
  ),
];
