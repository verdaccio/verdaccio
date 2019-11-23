import _ from 'lodash';
import { allow } from '../../middleware';
import { convertDistRemoteToLocalTarballUrls, getVersion, ErrorCode } from '../../../lib/utils';
import { HEADERS, DIST_TAGS, API_ERROR } from '../../../lib/constants';
import { Router } from 'express';
import { Config, Package } from '@verdaccio/types';
import { IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler } from '../../../../types';

const downloadStream = (packageName: string, filename: string, storage: any, req: $RequestExtend, res: $ResponseExtend): void => {
  const stream = storage.getTarball(packageName, filename);

  stream.on('content-length', function(content): void {
    res.header('Content-Length', content);
  });

  stream.on('error', function(err): void {
    return res.report_error(err);
  });

  res.header(HEADERS.CONTENT_TYPE, HEADERS.OCTET_STREAM);
  stream.pipe(res);
};

export default function(route: Router, auth: IAuth, storage: IStorageHandler, config: Config): void {
  const can = allow(auth);
  // TODO: anonymous user?
  route.get('/:package/:version?', can('access'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const getPackageMetaCallback = function(err, metadata: Package): void {
      if (err) {
        return next(err);
      }
      metadata = convertDistRemoteToLocalTarballUrls(metadata, req, config.url_prefix);

      let queryVersion = req.params.version;
      if (_.isNil(queryVersion)) {
        return next(metadata);
      }

      let version = getVersion(metadata, queryVersion);
      if (_.isNil(version) === false) {
        return next(version);
      }

      if (_.isNil(metadata[DIST_TAGS]) === false) {
        if (_.isNil(metadata[DIST_TAGS][queryVersion]) === false) {
          queryVersion = metadata[DIST_TAGS][queryVersion];
          version = getVersion(metadata, queryVersion);
          if (_.isNil(version) === false) {
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
      callback: getPackageMetaCallback,
    });
  });

  route.get('/:scopedPackage/-/:scope/:filename', can('access'), function(req: $RequestExtend, res: $ResponseExtend): void {
    const { scopedPackage, filename } = req.params;

    downloadStream(scopedPackage, filename, storage, req, res);
  });

  route.get('/:package/-/:filename', can('access'), function(req: $RequestExtend, res: $ResponseExtend): void {
    downloadStream(req.params.package, req.params.filename, storage, req, res);
  });
}
