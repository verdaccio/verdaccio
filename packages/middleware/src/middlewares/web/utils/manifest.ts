import buildDebug from 'debug';

export type Manifest = {
  // goes on first place at the header
  ico: string;
  css: string[];
  js: string[];
};

const debug = buildDebug('verdaccio:middleware:web:render:manifest');

export function getManifestValue(
  manifestItems: string[],
  manifest,
  basePath: string = ''
): string[] {
  return manifestItems?.map((item) => {
    debug('resolve item %o', item);
    const resolvedItem = `${stripTrailingSlash(basePath)}/${stripLeadingSlash(manifest[item])}`;
    debug('resolved item %o', resolvedItem);
    return resolvedItem;
  });
}

function stripTrailingSlash(path: string): string {
  return path.replace(/\/$/, '');
}

function stripLeadingSlash(path: string): string {
  return path.replace(/^\//, '');
}
