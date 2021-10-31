import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';

import sanitizyReadme from '@verdaccio/readme';

const debug = buildDebug('verdaccio:api:whoami');
export const NOT_README_FOUND = 'ERROR: No README data found!';

function getReadme(fastify: FastifyInstance, request: any, packageName, callback) {
  fastify.storage.getPackage({
    name: packageName,
    uplinksLook: true,
    req: request.raw,
    callback: function (err, readme): void {
      debug('readme pkg %o', readme?.name);
      if (err) {
        callback(err);
        return;
      }
      try {
        const parsedReadme = parseReadme(readme.name, readme.readme);
        callback(null, parsedReadme);
      } catch {
        callback(fastify.statusCode.NOT_FOUND).send(err);
      }
    },
  });
}

async function readmeRoute(fastify: FastifyInstance) {
  fastify.get('/package/readme/:packageName', async (request, reply) => {
    // @ts-ignore
    const { version, packageName } = request.params;
    debug('readme name %s   version: %s', packageName, version);
    getReadme(fastify, request, packageName, (err, readme) => {
      if (err) {
        reply.send(err);
      } else {
        reply.code(fastify.statusCode.OK).send(readme);
      }
    });
  });

  fastify.get('/package/readme/:scope/:packageName', async (request, reply) => {
    // @ts-ignore
    const { scope, packageName } = request.params;
    const packageNameScope = scope ? `${scope}/${packageName}` : packageName;
    debug('readme name %s', packageName);
    debug('readme endpoint scope:%s pkg: %s', scope, packageName);
    getReadme(fastify, request, packageNameScope, (err, readme) => {
      if (err) {
        reply.send(err);
      } else {
        reply.code(fastify.statusCode.OK).send(readme);
      }
    });
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
