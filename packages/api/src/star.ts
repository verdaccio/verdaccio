import { USERS, HTTP_STATUS } from '@verdaccio/dev-commons';
import { Response } from 'express';
import _ from 'lodash';
import { logger } from '@verdaccio/logger';
import buildDebug from 'debug';

import { $RequestExtend, $NextFunctionVer, IStorageHandler } from '@verdaccio/dev-types';

const debug = buildDebug('verdaccio:api:publish:star');

export default function (
  storage: IStorageHandler
): (req: $RequestExtend, res: Response, next: $NextFunctionVer) => void {
  const validateInputs = (newUsers, localUsers, username, isStar): boolean => {
    const isExistlocalUsers = _.isNil(localUsers[username]) === false;
    if (isStar && isExistlocalUsers && localUsers[username]) {
      return true;
    } else if (!isStar && isExistlocalUsers) {
      return false;
    } else if (!isStar && !isExistlocalUsers) {
      return true;
    }
    return false;
  };

  return (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
    const name = req.params.package;
    debug('starring a package for %o', name);
    const afterChangePackage = function (err?: Error) {
      if (err) {
        debug('error on update package for %o', name);
        return next(err);
      }

      debug('succes update package for %o', name);
      res.status(HTTP_STATUS.OK);
      next({
        success: true,
      });
    };

    debug('get package info package for %o', name);
    storage.getPackage({
      name,
      req,
      callback: function (err, info) {
        if (err) {
          debug('error on get package info package for %o', name);
          return next(err);
        }
        const newStarUser = req.body[USERS];
        const remoteUsername = req.remote_user.name;
        const localStarUsers = info[USERS];
        // Check is star or unstar
        const isStar = Object.keys(newStarUser).includes(remoteUsername);
        debug('is start? %o', isStar);
        if (
          _.isNil(localStarUsers) === false &&
          validateInputs(newStarUser, localStarUsers, remoteUsername, isStar)
        ) {
          return afterChangePackage();
        }
        const users = isStar
          ? {
              ...localStarUsers,
              [remoteUsername]: true,
            }
          : _.reduce(
              localStarUsers,
              (users, value, key) => {
                if (key !== remoteUsername) {
                  users[key] = value;
                }
                return users;
              },
              {}
            );
        debug('update package for  %o', name);
        storage.changePackage(name, { ...info, users }, req.body._rev, function (err) {
          afterChangePackage(err);
        });
      },
    });
  };
}
