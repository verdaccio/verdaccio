import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';

import { IAuth } from '@verdaccio/auth';
import { API_ERROR, DIST_TAGS, HEADERS, errorUtils } from '@verdaccio/core';
import { allow } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { convertDistRemoteToLocalTarballUrls } from '@verdaccio/tarball';
import { Config, Package } from '@verdaccio/types';
import { getVersion } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

const debug = buildDebug('verdaccio:api:package');

const downloadStream = (
  packageName: string,
  filename: string,
  storage: any,
  req: $RequestExtend,
  res: $ResponseExtend
): void => {
  const stream = storage.getTarball(packageName, filename);

  stream.on('content-length', function (content): void {
    res.header('Content-Length', content);
  });

  stream.on('error', function (err): void {
    return res.locals.report_error(err);
  });

  res.header(HEADERS.CONTENT_TYPE, HEADERS.OCTET_STREAM);
  stream.pipe(res);
};

export default function (route: Router, auth: IAuth, storage: Storage): void {
  const can = allow(auth);

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
      let queryVersion = req.params.version;
      const requestOptions = {
        protocol: req.protocol,
        headers: req.headers as any,
        // FIXME: if we migrate to req.hostname, the port is not longer included.
        host: req.host,
      };

      try {
        const manifest = await storage.getPackageNext({
          name,
          uplinksLook: true,
          req,
          version: queryVersion,
          requestOptions,
        });
        next(manifest);
      } catch (err) {
        next(err);
      }
    }
  );

  route.get(
    '/:scopedPackage/-/:scope/:filename',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend): void {
      const { scopedPackage, filename } = req.params;

      downloadStream(scopedPackage, filename, storage, req, res);
    }
  );

  route.get(
    '/:package/-/:filename',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend): void {
      downloadStream(req.params.package, req.params.filename, storage, req, res);
    }
  );
}
