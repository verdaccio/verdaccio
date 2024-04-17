import buildDebug from 'debug';
import { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE, stringUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { allow } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

const debug = buildDebug('verdaccio:api:package');

export default function (route: Router, auth: Auth, storage: Storage): void {
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });
  route.get(
    '/:package/:version?',
    can('access'),
    async function (
      req: $RequestExtend,
      _res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      debug('init package by version');
      const name = req.params.package;
      let version = req.params.version;
      const write = req.query.write === 'true';
      const abbreviated =
        stringUtils.getByQualityPriorityValue(req.get('Accept')) === Storage.ABBREVIATED_HEADER;
      debug(abbreviated ? 'abbreviated manifest' : 'full manifest');
      const requestOptions = {
        protocol: req.protocol,
        headers: req.headers as any,
        // FIXME: if we migrate to req.hostname, the port is not longer included.
        host: req.host,
        remoteAddress: req.socket.remoteAddress,
        byPassCache: write,
      };

      try {
        const manifest = await storage.getPackageByOptions({
          name,
          uplinksLook: true,
          abbreviated,
          version,
          requestOptions,
        });
        if (abbreviated) {
          _res.setHeader(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_INSTALL_CHARSET);
        } else {
          _res.setHeader(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
        }

        next(manifest);
      } catch (err) {
        next(err);
      }
    }
  );

  route.get(
    '/:package/-/:filename',
    can('access'),
    async function (req: $RequestExtend, res: $ResponseExtend, next): Promise<void> {
      const { package: pkgName, filename } = req.params;
      const abort = new AbortController();
      try {
        const stream = (await storage.getTarball(pkgName, filename, {
          signal: abort.signal,
          // TODO: review why this param
          // enableRemote: true,
        })) as any;

        stream.on('content-length', (size) => {
          res.header(HEADER_TYPE.CONTENT_LENGTH, size);
        });

        stream.once('error', (err) => {
          res.locals.report_error(err);
          next(err);
        });

        req.on('abort', () => {
          debug('request aborted for %o', req.url);
          abort.abort();
        });

        res.header(HEADERS.CONTENT_TYPE, HEADERS.OCTET_STREAM);
        stream.pipe(res);
      } catch (err: any) {
        // console.log('catch API error request', err);
        res.locals.report_error(err);
        next(err);
      }
    }
  );
}
