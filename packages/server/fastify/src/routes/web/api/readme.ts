import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';

import sanitizyReadme from '@verdaccio/readme';

const debug = buildDebug('verdaccio:fastify:web:readme');
export const NOT_README_FOUND = 'ERROR: No README data found!';

async function readmeRoute(fastify: FastifyInstance) {
  fastify.get('/package/readme/:packageName', async (request, reply) => {
    // @ts-ignore
    const { version, packageName } = request.params;
    debug('readme name %s   version: %s', packageName, version);
    const manifest = await fastify.storage?.getPackageByOptions({
      name: packageName,
      // remove on refactor getPackageByOptions
      // @ts-ignore
      req: request.raw,
      version,
      uplinksLook: true,
      requestOptions: {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
      },
    });
    try {
      const parsedReadme = parseReadme(manifest.name, manifest.readme as string);
      reply.code(fastify.statusCode.OK).send(parsedReadme);
    } catch {
      reply.code(fastify.statusCode.OK).send(NOT_README_FOUND);
    }
  });

  fastify.get('/package/readme/:scope/:packageName', async (request, reply) => {
    // @ts-ignore
    const { version, packageName } = request.params;
    debug('readme name %s   version: %s', packageName, version);
    const manifest = await fastify.storage?.getPackageByOptions({
      name: packageName,
      // remove on refactor getPackageByOptions
      // @ts-ignore
      req: request.raw,
      version,
      uplinksLook: true,
      requestOptions: {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
      },
    });
    try {
      const parsedReadme = parseReadme(manifest.name, manifest.readme as string);
      reply.code(fastify.statusCode.OK).send(parsedReadme);
    } catch {
      reply.code(fastify.statusCode.OK).send(NOT_README_FOUND);
    }
  });
}

export default readmeRoute;

/**
 * parse package readme - markdown/ascii
 * @param {String} packageName name of package
 * @param {String} readme package readme
 * @return {String} converted html template
 */
export function parseReadme(packageName: string, readme: string): string | void {
  if (_.isEmpty(readme) === false) {
    debug('sanizity readme');
    return sanitizyReadme(readme);
  }
  throw new Error('ERROR: No README data found!');
}
