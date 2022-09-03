import { Router } from 'express';
import _ from 'lodash';

import { Config, Package } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend, IAuth, IStorageHandler } from '../../../../types';
import { API_ERROR, DIST_TAGS, HEADERS } from '../../../lib/constants';
import { ErrorCode, convertDistRemoteToLocalTarballUrls, getVersion } from '../../../lib/utils';
import { allow } from '../../middleware';

const ABBREVIATED_HEADER = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*';
const downloadStream = (packageName: string, filename: string, storage: any, req: $RequestExtend, res: $ResponseExtend): void => {
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

const redirectOrDownloadStream = (packageName: string, filename: string, storage: any, req: $RequestExtend, res: $ResponseExtend, config: Config): void => {
  const tarballUrlRedirect = _.get(config, 'experiments.tarball_url_redirect');
  storage
    .hasLocalTarball(packageName, filename)
    .then((hasLocalTarball) => {
      if (hasLocalTarball) {
        const context = { packageName, filename };
        const tarballUrl = typeof tarballUrlRedirect === 'function' ? tarballUrlRedirect(context) : _.template(tarballUrlRedirect)(context);
        res.redirect(tarballUrl);
      } else {
        downloadStream(packageName, filename, storage, req, res);
      }
    })
    .catch((err) => {
      res.locals.report_error(err);
    });
};

export default function (route: Router, auth: IAuth, storage: IStorageHandler, config: Config): void {
  const can = allow(auth);
  // TODO: anonymous user?
  route.get('/:package/:version?', can('access'), function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const getPackageMetaCallback = function (err, metadata: Package): void {
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
    const abbreviated = req.get('Accept') === ABBREVIATED_HEADER;
    storage.getPackage({
      name: req.params.package,
      uplinksLook: true,
      req,
      abbreviated,
      callback: getPackageMetaCallback,
    });
  });

  route.get('/:scopedPackage/-/:scope/:filename', can('access'), function (req: $RequestExtend, res: $ResponseExtend): void {
    const { scopedPackage, filename } = req.params;
    if (_.get(config, 'experiments.tarball_url_redirect') === undefined) {
      downloadStream(scopedPackage, filename, storage, req, res);
    } else {
      redirectOrDownloadStream(scopedPackage, filename, storage, req, res, config);
    }
  });

  route.get('/:package/-/:filename', can('access'), function (req: $RequestExtend, res: $ResponseExtend): void {
    if (_.get(config, 'experiments.tarball_url_redirect') === undefined) {
      downloadStream(req.params.package, req.params.filename, storage, req, res);
    } else {
      redirectOrDownloadStream(req.params.package, req.params.filename, storage, req, res, config);
    }
  });
}
