/**
 * return package version from tarball name
 * @param {String} name
 * @returns {String}
 */
export function getVersionFromTarball(name: string): string | void {
  const groups = name.match(/.+-(\d.+)\.tgz/);

  return groups !== null ? groups[1] : undefined;
}
