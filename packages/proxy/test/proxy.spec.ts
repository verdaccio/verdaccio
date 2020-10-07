import { Readable } from 'stream';
import nock from 'nock';
import supertest from 'supertest';

import Proxy from '../src/proxy';

beforeEach(() => {
  nock.cleanAll();
});

jest.setTimeout(2000000);

test('dsadas', async () => {
  nock('https://registry.verdaccio.org').get('/').reply(200);

  const proxy = new Proxy({
    url: 'https://registry.verdaccio.org',
  });
});
