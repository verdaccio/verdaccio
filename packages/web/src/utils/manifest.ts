import buildDebug from 'debug';

export type Manifest = {
  // goes on first place at the header
  ico: string;
  css: string[];
  js: string[];
};

const debug = buildDebug('verdaccio:web:render:manifest');

export function getManifestByValue(manifestItem: string, manifest): string {
  debug('resolve item %o', manifestItem);
  const resolvedItem = manifest[manifestItem];
  debug('resolved item %o', resolvedItem);
  return resolvedItem;
}

export function getManifestValue(manifestItems: string[], manifest): string[] {
  return manifestItems.map((item) => {
    debug('resolve item %o', item);
    const resolvedItem = manifest[item];
    debug('resolved item %o', resolvedItem);
    return resolvedItem;
  });
}
