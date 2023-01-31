import { Router } from 'express';
import _ from 'lodash';

import { allow } from '@verdaccio/middleware';
import { convertDistRemoteToLocalTarballUrls } from '@verdaccio/tarball';
import { Config, Package } from '@verdaccio/types';

import { API_ERROR, DIST_TAGS, HEADERS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';
import { ErrorCode, getVersion } from '../../../lib/utils';
import {
  $NextFunctionVer,
  $RequestExtend,
  $ResponseExtend,
  IAuth,
  IStorageHandler,
} from '../../../types';
import { getByQualityPriorityValue } from '../../../utils/string';

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

const redirectOrDownloadStream = (
  packageName: string,
  filename: string,
  storage: any,
  req: $RequestExtend,
  res: $ResponseExtend,
  config: Config
): void => {
  const tarballUrlRedirect = _.get(config, 'experiments.tarball_url_redirect');
  storage
    .hasLocalTarball(packageName, filename)
    .then((hasLocalTarball) => {
      if (hasLocalTarball) {
        const context = { packageName, filename };
        const tarballUrl =
          typeof tarballUrlRedirect === 'function'
            ? tarballUrlRedirect(context)
            : _.template(tarballUrlRedirect)(context);
        res.redirect(tarballUrl);
      } else {
        downloadStream(packageName, filename, storage, req, res);
      }
    })
    .catch((err) => {
      res.locals.report_error(err);
    });
};

export default function (
  route: Router,
  auth: IAuth,
  storage: IStorageHandler,
  config: Config
): void {
  const can = allow(auth, {
    beforeAll: (params, message) => logger.trace(params, message),
    afterAll: (params, message) => logger.trace(params, message),
  });
  // TODO: anonymous user?
  route.get(
    '/:package/:version?',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const abbreviated =
        getByQualityPriorityValue(req.get('Accept')) === 'application/vnd.npm.install-v1+json';
      const getPackageMetaCallback = function (err, metadata: Package): void {
        if (err) {
          return next(err);
        }
        metadata = convertDistRemoteToLocalTarballUrls(
          metadata,
          {
            protocol: req.protocol,
            headers: req.headers as any,
            host: req.host,
            remoteAddress: req.socket.remoteAddress,
          },
          config.url_prefix
        );

        let queryVersion = req.params.version;
        if (_.isNil(queryVersion)) {
          if (abbreviated) {
            res.setHeader(HEADERS.CONTENT_TYPE, 'application/vnd.npm.install-v1+json');
          } else {
            res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON);
          }

          return next(metadata);
        }

        let version = getVersion(metadata, queryVersion);
        if (_.isNil(version) === false) {
          res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON);
          return next(version);
        }

        if (_.isNil(metadata[DIST_TAGS]) === false) {
          if (_.isNil(metadata[DIST_TAGS][queryVersion]) === false) {
            queryVersion = metadata[DIST_TAGS][queryVersion];
            version = getVersion(metadata, queryVersion);
            if (_.isNil(version) === false) {
              res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON);
              return next(version);
            }
          }
        }
        return next(ErrorCode.getNotFound(`${API_ERROR.VERSION_NOT_EXIST}: ${req.params.version}`));
      };

      storage.getPackage({
        name: req.params.package,
        uplinksLook: true,
        req,
        abbreviated,
        callback: getPackageMetaCallback,
      });
    }
  );

  route.get(
    '/:scopedPackage/-/:scope/:filename',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend): void {
      const { scopedPackage, filename } = req.params;
      if (_.get(config, 'experiments.tarball_url_redirect') === undefined) {
        downloadStream(scopedPackage, filename, storage, req, res);
      } else {
        redirectOrDownloadStream(scopedPackage, filename, storage, req, res, config);
      }
    }
  );

  route.get(
    '/:package/-/:filename',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend): void {
      if (_.get(config, 'experiments.tarball_url_redirect') === undefined) {
        downloadStream(req.params.package, req.params.filename, storage, req, res);
      } else {
        redirectOrDownloadStream(
          req.params.package,
          req.params.filename,
          storage,
          req,
          res,
          config
        );
      }
    }
  );
}
