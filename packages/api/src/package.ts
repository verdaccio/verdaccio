import _ from 'lodash';
import { Router } from 'express';
import buildDebug from 'debug';

import { allow } from '@verdaccio/middleware';
import { convertDistRemoteToLocalTarballUrls, getVersion, ErrorCode } from '@verdaccio/utils';
import { HEADERS, DIST_TAGS, API_ERROR } from '@verdaccio/dev-commons';
import { Config, Package } from '@verdaccio/types';
import {
  IAuth,
  $ResponseExtend,
  $RequestExtend,
  $NextFunctionVer,
  IStorageHandler,
} from '@verdaccio/dev-types';

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

export default function (
  route: Router,
  auth: IAuth,
  storage: IStorageHandler,
  config: Config
): void {
  const can = allow(auth);
  // TODO: anonymous user?
  route.get('/:package/:version?', can('access'), function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ): void {
    debug('init package by version');
    const name = req.params.package;
    const getPackageMetaCallback = function (err, metadata: Package): void {
      if (err) {
        debug('error on fetch metadata for %o with error %o', name, err.message);
        return next(err);
      }
      debug('convert dist remote to local with prefix %o', config?.url_prefix);
      metadata = convertDistRemoteToLocalTarballUrls(metadata, req, config?.url_prefix);

      let queryVersion = req.params.version;
      debug('query by param version: %o', queryVersion);
      if (_.isNil(queryVersion)) {
        debug('param %o version found', queryVersion);
        return next(metadata);
      }

      let version = getVersion(metadata, queryVersion);
      debug('query by latest version %o and result %o', queryVersion, version);
      if (_.isNil(version) === false) {
        debug('latest version found %o', version);
        return next(version);
      }

      if (_.isNil(metadata[DIST_TAGS]) === false) {
        if (_.isNil(metadata[DIST_TAGS][queryVersion]) === false) {
          queryVersion = metadata[DIST_TAGS][queryVersion];
          debug('dist-tag version found %o', queryVersion);
          version = getVersion(metadata, queryVersion);
          if (_.isNil(version) === false) {
            debug('dist-tag found %o', version);
            return next(version);
          }
        }
      } else {
        debug('dist tag not detected');
      }

      debug('package version not found %o', queryVersion);
      return next(ErrorCode.getNotFound(`${API_ERROR.VERSION_NOT_EXIST}: ${queryVersion}`));
    };

    debug('get package name %o', name);
    debug('uplinks look up enabled');
    storage.getPackage({
      name,
      uplinksLook: true,
      req,
      callback: getPackageMetaCallback,
    });
  });

  route.get('/:scopedPackage/-/:scope/:filename', can('access'), function (
    req: $RequestExtend,
    res: $ResponseExtend
  ): void {
    const { scopedPackage, filename } = req.params;

    downloadStream(scopedPackage, filename, storage, req, res);
  });

  route.get('/:package/-/:filename', can('access'), function (
    req: $RequestExtend,
    res: $ResponseExtend
  ): void {
    downloadStream(req.params.package, req.params.filename, storage, req, res);
  });
}
