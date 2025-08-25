import { orderBy } from 'lodash';

import { searchUtils } from '@verdaccio/core';

export function removeDuplicates(items: searchUtils.SearchPackageItem[]) {
  const pkgNames: any[] = [];
  const orderByResults = orderBy(items, ['verdaccioPrivate', 'asc']);
  return orderByResults.filter((pkg) => {
    if (pkgNames.includes(pkg?.package?.name)) {
      return false;
    }
    pkgNames.push(pkg?.package?.name);
    return true;
  });
}
