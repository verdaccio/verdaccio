export function getRegistryURL() {
  // Don't add slash if it's not a sub directory
  return `${location.origin}${location.pathname === '/' ? '' : location.pathname}`;
}
