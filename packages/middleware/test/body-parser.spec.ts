import express from 'express';
import request from 'supertest';
import { describe, expect, test } from 'vitest';

import { registerBodyParser } from '../src';

const getStackLength = (app: any): number => {
  return app?.stack?.length ?? 0;
};

describe('body-parser middleware', () => {
  test('registerBodyParser should parse JSON bodies (strict=false)', async () => {
    const router = express.Router();
    registerBodyParser(router as any, { max_body_size: '10mb' } as any);

    router.post('/object', (req, res) => {
      res.json(req.body);
    });

    const app = express();
    app.use(router);

    const res = await request(app).post('/object').send({ a: 1 }).expect(200);
    expect(res.body).toEqual({ a: 1 });
  });

  test('registerBodyParser should parse JSON arrays/primitives (strict=false)', async () => {
    const router = express.Router();
    registerBodyParser(router as any, { max_body_size: '10mb' } as any);

    router.post('/array', (req, res) => {
      res.json(req.body);
    });
    router.post('/primitive', (req, res) => {
      res.json(req.body);
    });

    const app = express();
    app.use(router);

    const arrayRes = await request(app).post('/array').send([1, 2, 3]).expect(200);
    expect(arrayRes.body).toEqual([1, 2, 3]);

    // strict=false should allow top-level strings (top-level JSON string)
    const primitiveRes = await request(app)
      .post('/primitive')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify('hello'))
      .expect(200);
    expect(primitiveRes.body).toEqual('hello');
  });

  test('registerBodyParser should not register jsonParser twice', () => {
    const router = express.Router();
    const config = { max_body_size: '10mb' } as any;

    const before = getStackLength(router);

    registerBodyParser(router as any, config);
    const afterFirst = getStackLength(router);

    registerBodyParser(router as any, config);
    const afterSecond = getStackLength(router);

    expect(afterFirst).toBeGreaterThan(before);
    expect(afterSecond).toBe(afterFirst);
  });

  test('registerBodyParser should enforce max_body_size limit', async () => {
    const router = express.Router();
    registerBodyParser(router, { max_body_size: '1kb' } as any);

    const app = express();

    router.post('/limited', (req, res) => {
      res.json({ ok: true, body: req.body });
    });

    app.use(router);

    const bigPayload = { data: 'a'.repeat(2048) };
    await request(app).post('/limited').send(bigPayload).expect(413);
  });
});
