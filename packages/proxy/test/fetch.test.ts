import { Readable } from 'stream';
import nock from 'nock';
import supertest from 'supertest';

import { fetch } from '../src/fetch';
import { prepareApp } from './helper/app';

const util = require('util');
const fs = require('fs');
const streamPipeline = util.promisify(require('stream').pipeline);

beforeEach(() => {
  nock.cleanAll();
});

jest.setTimeout(2000000);

test('dsadas', async () => {
  const responseText = 'input string';
  const filePath = '/node-fetch/-/node-fetch-3.0.0-beta.1.tgz';
  const readable = Readable.from([responseText]);
  nock('https://registry.verdaccio.org')
    .get(filePath)
    .times(5)
    .reply(500)
    .get(filePath)
    .reply(200, (uri, requestBody) => {
      return readable;
    });

  const app = prepareApp(async (req, res, next) => {
    try {
      const response = await fetch();
      console.log('--response.ok', response.ok);
      if (response.ok) {
        res.status(200);
        console.log('response.body', response.body);
        await streamPipeline(response.body, res);
        return next('dsads');
      }

      return next(new Error('error on call'));
    } catch (error) {
      console.error('-----------', error);
      res.status(501);
      next();
    }
  });

  return supertest(app)
    .get('/fetch')
    .expect(200)
    .then((response) => {
      expect(response.text).toEqual(responseText);
    });
});
