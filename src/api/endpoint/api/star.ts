// @flow

import { Response } from 'express';
import _ from 'lodash';
import { USERS, HTTP_STATUS } from '../../../lib/constants';
import { $RequestExtend, $NextFunctionVer, IStorageHandler } from '../../../../types';
import { logger } from '../../../lib/logger';

export default function(
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
    logger.debug({ name }, 'starring a package for @{name}');
    const afterChangePackage = function(err?: Error) {
      if (err) {
        return next(err);
      }
      res.status(HTTP_STATUS.OK);
      next({
        success: true
      });
    };

    storage.getPackage({
      name,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }
        const newStarUser = req.body[USERS];
        const remoteUsername = req.remote_user.name;
        const localStarUsers = info[USERS];
        // Check is star or unstar
        const isStar = Object.keys(newStarUser).includes(remoteUsername);
        if (
          _.isNil(localStarUsers) === false &&
          validateInputs(newStarUser, localStarUsers, remoteUsername, isStar)
        ) {
          return afterChangePackage();
        }
        const users = isStar
          ? {
              ...localStarUsers,
              [remoteUsername]: true
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
        storage.changePackage(name, { ...info, users }, req.body._rev, function(err) {
          afterChangePackage(err);
        });
      }
    });
  };
}
