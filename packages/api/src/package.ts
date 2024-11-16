import buildDebug from 'debug';
import { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE, stringUtils } from '@verdaccio/core';
import { allow } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Logger } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

const debug = buildDebug('verdaccio:api:package');

export default function (route: Router, auth: Auth, storage: Storage, logger: Logger): void {
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
      debug('get package by version');
      const name = req.params.package;
      let version = req.params.version;
      const write = req.query.write === 'true';
      const username = req?.remote_user?.name;
      const abbreviated =
        stringUtils.getByQualityPriorityValue(req.get('Accept')) === Storage.ABBREVIATED_HEADER;
      if (debug.enabled) {
        debug('is write %o', write);
        debug('is abbreviated %o', abbreviated);
        debug('package %o', name);
        debug('version %o', version);
        debug('username %o', username);
        debug('remote address %o', req.socket.remoteAddress);
        debug('host %o', req.host);
        debug('protocol %o', req.protocol);
        debug('url %o', req.url);
      }
      const requestOptions = {
        protocol: req.protocol,
        headers: req.headers as any,
        // FIXME: if we migrate to req.hostname, the port is not longer included.
        host: req.host,
        remoteAddress: req.socket.remoteAddress,
        byPassCache: write,
        username,
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
          debug('abbreviated response');
          _res.setHeader(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_INSTALL_CHARSET);
        } else {
          debug('full response');
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
        debug('downloading tarball %o', filename);
        const stream = (await storage.getTarball(pkgName, filename, {
          signal: abort.signal,
          // TODO: review why this param
          // enableRemote: true,
        })) as any;

        stream.on('content-length', (size) => {
          debug('tarball size %o', size);
          res.header(HEADER_TYPE.CONTENT_LENGTH, size);
        });

        stream.once('error', (err) => {
          debug('error on download tarball %o', err);
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
        res.locals.report_error(err);
        next(err);
      }
    }
  );
}
