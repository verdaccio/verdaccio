import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { Manifest, Version } from '@verdaccio/types';

const debug = buildDebug('verdaccio:fastify:web:sidebar');
export type $SidebarPackage = Manifest & { latest: Version };
const stringType = { type: 'string' };
const packageNameSchema = { packageName: stringType };
const paramsSchema = {
  scope: stringType,
  packageName: stringType,
};

async function sidebarRoute(fastify: FastifyInstance) {
  fastify.get(
    '/sidebar/:scope/:packageName',
    {
      schema: {
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      // @ts-ignore
      const { packageName, scope } = request.params;
      debug('pkg name %s, scope %s ', packageName, scope);
      reply.code(fastify.statusCode.NOT_FOUND);
    }
  );

  fastify.get(
    '/sidebar/:packageName',
    {
      schema: {
        params: packageNameSchema,
      },
    },
    async (request, reply) => {
      // @ts-ignore
      const { packageName, scope } = request.params;
      debug('pkg name %s, scope %s ', packageName, scope);
      reply.code(fastify.statusCode.NOT_FOUND);
    }
  );
}

// function getSidebar(fastify: FastifyInstance, request: any, packageName, callback) {
//   // fastify.storage.getPackage({
//   //   name: packageName,
//   //   uplinksLook: true,
//   //   keepUpLinkData: true,
//   //   req: request.raw,
//   //   callback: function (err: Error, info: $SidebarPackage): void {
//   //     debug('sidebar pkg info %o', info);
//   //     if (_.isNil(err)) {
//   //       const { v } = request.query;
//   //       let sideBarInfo = _.clone(info);
//   //       sideBarInfo.versions = convertDistRemoteToLocalTarballUrls(
//   //         info,
//   //         { protocol: request.protocol, headers: request.headers as any, host: request.hostname },
//   //         fastify.configInstance.url_prefix
//   //       ).versions;
//   //       if (typeof v === 'string' && isVersionValid(info, v)) {
//   //         sideBarInfo.latest = sideBarInfo.versions[v];
//   //         sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
//   //       } else {
//   //         sideBarInfo.latest = sideBarInfo.versions[info[DIST_TAGS].latest];
//   //         sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
//   //       }
//   //       sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
//   //       const authorAvatar = fastify.configInstance.web
//   //         ? addGravatarSupport(sideBarInfo, fastify.configInstance.web.gravatar)
//   //         : addGravatarSupport(sideBarInfo);
//   //       callback(null, authorAvatar);
//   //     } else {
//   //       callback(fastify.statusCode.NOT_FOUND).send(err);
//   //     }
//   //   },
//   // });
//   reply.code(fastify.statusCode.NOT_FOUND);
// }
export default sidebarRoute;
