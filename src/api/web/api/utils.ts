export function wrapPath(urlPath: string) {
  return `/-/verdaccio/data${urlPath}`;
}


export function wrapSecPath(urlPath: string) {
    return `/-/verdaccio/sec${urlPath}`;
  }
  