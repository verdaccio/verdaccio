import { PackageMetaInterface } from '../../../types/packageMeta';

function isPackageVersionValid(
  packageMeta: Partial<PackageMetaInterface>,
  packageVersion?: string
): boolean {
  if (!packageVersion || typeof packageVersion === 'undefined') {
    // if is undefined, that means versions does not exist, we continue
    return true;
  }

  if (packageMeta.versions) {
    return Object.keys(packageMeta.versions).includes(packageVersion);
  }

  return false;
}

export default isPackageVersionValid;
