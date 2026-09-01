import { createHash, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import supertest from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, fileUtils } from '@verdaccio/core';

import endPointAPI from '../../../src/api/index';
import { setup } from '../../../src/lib/logger';
import config from '../partials/config';

setup({});

/** Build one ustar entry: 512-byte header + content padded to 512. */
function tarEntry(name: string, content: Buffer): Buffer {
  const header = Buffer.alloc(512);
  header.write(name, 0);
  header.write('0000644\0', 100); // mode
  header.write('0000000\0', 108); // uid
  header.write('0000000\0', 116); // gid
  header.write(content.length.toString(8).padStart(11, '0') + '\0', 124); // size
  header.write('00000000000\0', 136); // mtime
  header.write('        ', 148); // checksum placeholder (spaces while summing)
  header.write('0', 156); // typeflag: regular file
  header.write('ustar', 257); // magic (NUL-terminated by the zeroed buffer)
  header.write('00', 263); // version
  let sum = 0;
  for (const byte of header) {
    sum += byte;
  }
  header.write(sum.toString(8).padStart(6, '0') + '\0 ', 148);
  const padding = Buffer.alloc((512 - (content.length % 512)) % 512);
  return Buffer.concat([header, content, padding]);
}

/** Build a valid .tgz with an incompressible payload of `payloadSize` bytes. */
function makeTarball(pkgName: string, payloadSize: number): Buffer {
  const manifest = Buffer.from(JSON.stringify({ name: pkgName, version: '1.0.0' }));
  const tar = Buffer.concat([
    tarEntry('package/package.json', manifest),
    tarEntry('package/payload.bin', randomBytes(payloadSize)),
    Buffer.alloc(1024), // end-of-archive marker
  ]);
  return gzipSync(tar);
}

describe('tarball responses are not re-compressed', () => {
  vi.setConfig({ testTimeout: 20000 });
  let app;
  const pkgName = 'big-tarball';
  // A valid .tgz over compression's 1kb threshold: without the octet-stream
  // filter, compression() would gzip this response for gzip-accepting clients
  // (mime-db marks octet-stream as compressible) and drop Content-Length.
  const tarball = makeTarball(pkgName, 4096);

  beforeAll(async () => {
    const storage = await fileUtils.createTempStorageFolder('api-compression');
    app = await endPointAPI(
      config({
        storage,
        packages: { '**': { access: '$all', publish: '$all', proxy: [] } },
      })
    );

    await supertest(app)
      .put(`/${pkgName}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          _id: pkgName,
          name: pkgName,
          'dist-tags': { latest: '1.0.0' },
          versions: {
            '1.0.0': {
              name: pkgName,
              version: '1.0.0',
              dist: {
                shasum: createHash('sha1').update(tarball).digest('hex'),
                tarball: `http://localhost:5555/${pkgName}/-/${pkgName}-1.0.0.tgz`,
              },
            },
          },
          _attachments: {
            [`${pkgName}-1.0.0.tgz`]: {
              content_type: HEADERS.OCTET_STREAM,
              data: tarball.toString('base64'),
              length: tarball.length,
            },
          },
        })
      )
      .expect(HTTP_STATUS.CREATED);
  });

  test('serves the tarball uncompressed and with content-length for gzip clients', async () => {
    const response = await supertest(app)
      .get(`/${pkgName}/-/${pkgName}-1.0.0.tgz`)
      .set(HEADER_TYPE.ACCEPT_ENCODING, 'gzip')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
      .expect(HTTP_STATUS.OK);

    expect(response.headers['content-encoding']).toBeUndefined();
    expect(parseInt(response.headers[HEADER_TYPE.CONTENT_LENGTH], 10)).toEqual(tarball.length);
  });
});
