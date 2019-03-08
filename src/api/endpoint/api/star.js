// @flow

import type {$Response} from 'express';
import type {$RequestExtend, $NextFunctionVer, IStorageHandler} from '../../../../types';

export default function(storage: IStorageHandler) {
  return (req: $RequestExtend, res: $Response, next: $NextFunctionVer): void => {
    const name = req.params.package;
    // Check is star or unstar
    const isStar = Object.keys(req.body.users).indexOf(req.remote_user.name) >= 0;
    const afterChangePackage = function(err) {
      if (err) {
        return next(err);
      }
      res.status(200);
      next({
        success: true,
      });
    };

    storage.getPackage({
      name,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }
        let newUsers = {
          ...info.users,
        };
        if (isStar) {
          newUsers = {
            ...newUsers,
            [req.remote_user.name]: true,
          };
        } else if (newUsers[req.remote_user.name]) {
          delete newUsers[req.remote_user.name];
        }
        const newMetadata = {
          ...info,
          users: newUsers,
        };
        storage.changePackage(name, newMetadata, req.body._rev, function(err) {
          afterChangePackage(err);
        });
      },
    });
  };
}
