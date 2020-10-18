export const encodeScope = function (thing): string {
  return encodeURIComponent(thing).replace(/^%40/, '@');
};

export function prepareUrl(url) {
  return url.replace(/\/$/, '');
}

export function getRemoteMetadataUrl(domainUrl, tarball) {
  return `${domainUrl}/${encodeScope(tarball)}`;
}
