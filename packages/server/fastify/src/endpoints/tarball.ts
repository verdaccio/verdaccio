/* eslint-disable @typescript-eslint/no-unused-vars */
import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { HEADERS, HEADER_TYPE } from '@verdaccio/core';

const debug = buildDebug('verdaccio:fastify:tarball');

async function tarballRoute(fastify: FastifyInstance) {
  fastify.get('/:package/-/:filename', async (request, reply) => {
    // @ts-ignore
    const { package: pkg, filename } = request.params;
    debug('stream tarball for %s@%s', pkg, filename);
    const abort = new AbortController();
    const stream = (await fastify.storage.getTarballNext(pkg, filename, {
      signal: abort.signal,
      // enableRemote: true,
    })) as any;

    request.raw.on('abort', () => {
      debug('request aborted for %o', request.url);
      abort.abort();
    });

    return reply.send(stream);
  });

  fastify.get('/:scopedPackage/-/:scope/:filename', async (request, reply) => {
    const abort = new AbortController();
    // @ts-ignore
    const { scopedPackage, filename } = request.params;
    debug('stream scope tarball for %s@%s', scopedPackage, filename);
    const stream = (await fastify.storage.getTarballNext(scopedPackage, filename, {
      signal: abort.signal,
      // enableRemote: true,
    })) as any;

    stream.on('content-length', (size: number) => {
      reply.header(HEADER_TYPE.CONTENT_LENGTH, size);
    });

    request.raw.on('abort', () => {
      debug('request aborted for %o', request.url);
      abort.abort();
    });

    reply.header(HEADERS.CONTENT_TYPE, HEADERS.OCTET_STREAM);
    return reply.send(stream);
  });
}

export default tarballRoute;
