/**
 * @prettier

 */
import _ from 'lodash';
import { USERS, HTTP_STATUS } from '../../../lib/constants';
import { Response, Router } from 'express';
import { $RequestExtend, $NextFunctionVer, IStorageHandler } from '../../../../types';
import { Package } from '@verdaccio/types';

type Packages = Package[];

export default function(route: Router, storage: IStorageHandler) {
  route.get('/-/_view/starredByUser', (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
      const remoteUsername = req.remote_user.name;

      storage.getLocalDatabase((err, localPackages: Packages) => {
        if (err) {
          return next(err);
        }

        const filteredPackages: Packages = localPackages.filter((localPackage: Package) =>
          localPackage[USERS] ? _.keys(localPackage[USERS]).indexOf(remoteUsername) >= 0 : false
        );

        res.status(HTTP_STATUS.OK);
        next({
          rows: filteredPackages.map((filteredPackage: Package) => ({
            value: filteredPackage.name,
          })),
        });
      });
    }
  );
}
