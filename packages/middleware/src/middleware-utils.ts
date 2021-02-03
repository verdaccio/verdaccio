/**
 * return package version from tarball name
 * @param {String} name
 * @returns {String}
 */
export function getVersionFromTarball(name: string): string | void {
  // FIXME: we know the regex is valid, but we should improve this part as ts suggest
  // @ts-ignore
  return /.+-(\d.+)\.tgz/.test(name) ? name.match(/.+-(\d.+)\.tgz/)[1] : undefined;
}
