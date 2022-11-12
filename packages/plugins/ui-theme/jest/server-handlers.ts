import { rest } from 'msw';

const packagesPayload = require('./api/packages.json');

export const handlers = [
  rest.get('http://localhost:9000/-/verdaccio/data/packages', (req, res, ctx) => {
    return res(ctx.json(packagesPayload));
  }),

  rest.post<{ username: string; password: string }, { token: string; username: string }>(
    'http://localhost:9000/-/verdaccio/sec/login',
    // @ts-ignore
    async (req, res, ctx) => {
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
