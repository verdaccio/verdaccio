export function getRegistryURL() {
  // Don't add slash if it's not a sub directory
  return `${location.origin}${location.pathname === '/' ? '' : location.pathname}`;
}

/**
 * Get specified package detail page url
 * @param {string} packageName
 */
export function getDetailPageURL(packageName) {
  return `${getRegistryURL()}/-/web/version/${packageName}`;
}
