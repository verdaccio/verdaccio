import supertest from 'supertest';
import type { Test } from 'supertest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from './generatePackageMetadata';

export function publishVersion(app, pkgName, version, metadata: Partial<Manifest> = {}): any {
  const pkgMetadata = { ...generatePackageMetadata(pkgName, version), ...metadata };

  return supertest(app)
    .put(`/${encodeURIComponent(pkgName)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(pkgMetadata))
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
}

export async function publishTaggedVersion(app, pkgName, version, tag) {
  const pkgMetadata = generatePackageMetadata(pkgName, version, {
    [tag]: version,
  });

  return supertest(app)
    .put(
      `/${encodeURIComponent(pkgName)}/${encodeURIComponent(version)}/-tag/${encodeURIComponent(
        tag
      )}`
    )
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(pkgMetadata))
    .expect(HTTP_STATUS.CREATED)
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON) as Test;
}
