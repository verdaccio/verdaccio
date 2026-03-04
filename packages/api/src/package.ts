import buildDebug from 'debug';
import { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE, stringUtils } from '@verdaccio/core';
import { allow, getRequestOptions } from '@verdaccio/middleware';
import { PACKAGE_API_ENDPOINTS } from '@verdaccio/middleware';
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
    PACKAGE_API_ENDPOINTS.get_package_by_version,
    can('access'),
    async function (
      req: $RequestExtend,
      _res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const name = req.params.package;
      const version = req.params.version;
      debug('get package by version: %o %o', name, version);
      const abbreviated =
        stringUtils.getByQualityPriorityValue(req.get('Accept')) === Storage.ABBREVIATED_HEADER;
      debug('abbreviated: %o', abbreviated);

      const requestOptions = getRequestOptions(req);

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
    PACKAGE_API_ENDPOINTS.get_package_tarball,
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
