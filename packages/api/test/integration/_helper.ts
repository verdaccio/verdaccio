import path from 'path';
import express, { Application } from 'express';
import supertest from 'supertest';
import bodyParser from 'body-parser';

import { Config, parseConfigFile } from '@verdaccio/config';
import { Storage } from '@verdaccio/store';
import { final, handleError, errorReportingMiddleware } from '@verdaccio/middleware';
import { Auth, IAuth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE, HTTP_STATUS, generatePackageMetadata } from '@verdaccio/commons-api';
import apiEndpoints from '../../src';

const getConf = (conf) => {
  const configPath = path.join(__dirname, 'config', conf);

  return parseConfigFile(configPath);
};

export async function initializeServer(configName): Promise<Application> {
  const app = express();
  const config = new Config(getConf(configName));
  const storage = new Storage(config);
  await storage.init(config, []);
  const auth: IAuth = new Auth(config);
  // TODO: this might not be need it, used in apiEndpoints
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  // @ts-ignore
  app.use(errorReportingMiddleware);
  // @ts-ignore
  app.use(apiEndpoints(config, auth, storage));
  // @ts-ignore
  app.use(handleError);
  // @ts-ignore
  app.use(final);

  app.use(function (request, response) {
    response.status(590);
    console.log('respo', response);
    response.json({ error: 'cannot handle this' });
  });

  return app;
}

export function publishVersion(app, configFile, pkgName, version): supertest.Test {
  const pkgMetadata = generatePackageMetadata(pkgName, version);

  return supertest(app)
    .put(`/${encodeURIComponent(pkgName)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(pkgMetadata))
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
}

export async function publishTaggedVersion(
  app,
  configFile,
  pkgName: string,
  version: string,
  tag: string
) {
  const pkgMetadata = generatePackageMetadata(pkgName, version, {
    [tag]: version,
  });

  return supertest(app)
    .put(
      `/${encodeURIComponent(pkgName)}/${encodeURIComponent(version)}/-tag/${encodeURIComponent(
        tag
      )}`
    )
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(pkgMetadata))
    .expect(HTTP_STATUS.CREATED)
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
}
