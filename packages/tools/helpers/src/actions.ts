import buildDebug from 'debug';
import supertest from 'supertest';

import { HEADERS, HEADER_TYPE } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from './generatePackageMetadata';

const debug = buildDebug('verdaccio:tools:helpers:actions');

export function publishVersion(app: any, pkgName, version, metadata: Partial<Manifest> = {}): any {
  debug('publishVersion %s : %s : %s', pkgName, version, JSON.stringify(metadata, null, 2));
  let pkgMetadata = { ...generatePackageMetadata(pkgName, version), ...metadata };
  // sync metadata readme to version of package
  pkgMetadata.versions[version].readme = metadata.readme ? (metadata.readme as string) : '';
  debug('metadata %s', JSON.stringify(pkgMetadata, null, 2));
  return (
    supertest(app)
      .put(`/${encodeURIComponent(pkgName)}`)
      // @ts-ignore ignore content-type mismatch
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify(pkgMetadata))
      .set('accept', HEADERS.GZIP)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
  );
}
