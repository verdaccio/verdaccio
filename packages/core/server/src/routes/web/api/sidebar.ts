import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';

import { DIST_TAGS } from '@verdaccio/core';
import { convertDistRemoteToLocalTarballUrls } from '@verdaccio/tarball';
import { Package, Version } from '@verdaccio/types';
import {
  addGravatarSupport,
  deleteProperties,
  formatAuthor,
  isVersionValid,
} from '@verdaccio/utils';

const debug = buildDebug('verdaccio:web:api:sidebar');
export type $SidebarPackage = Package & { latest: Version };
const scopeParam = { type: 'string' };
const packageNameParam = { type: 'string' };
const packageNameSchema = { packageName: packageNameParam };
const paramsSchema = {
  scope: scopeParam,
  packageName: packageNameParam,
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
      getSidebar(fastify, request, packageName, (err, sidebar) => {
        if (err) {
          reply.send(err);
        } else {
          reply.code(fastify.statusCode.OK).send(sidebar);
        }
      });
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
      getSidebar(fastify, request, packageName, (err, sidebar) => {
        if (err) {
          reply.send(err);
        } else {
          reply.code(fastify.statusCode.OK).send(sidebar);
        }
      });
    }
  );
}

function getSidebar(fastify: FastifyInstance, request: any, packageName, callback) {
  fastify.storage.getPackage({
    name: packageName,
    uplinksLook: true,
    keepUpLinkData: true,
    req: request.raw,
    callback: function (err: Error, info: $SidebarPackage): void {
      debug('sidebar pkg info %o', info);

      if (_.isNil(err)) {
        const { v } = request.query;
        let sideBarInfo = _.clone(info);
        sideBarInfo.versions = convertDistRemoteToLocalTarballUrls(
          info,
          { protocol: request.protocol, headers: request.headers as any, host: request.hostname },
          fastify.configInstance.url_prefix
        ).versions;
        if (typeof v === 'string' && isVersionValid(info, v)) {
          sideBarInfo.latest = sideBarInfo.versions[v];
          sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
        } else {
          sideBarInfo.latest = sideBarInfo.versions[info[DIST_TAGS].latest];
          sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
        }
        sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
        const authorAvatar = fastify.configInstance.web
          ? addGravatarSupport(sideBarInfo, fastify.configInstance.web.gravatar)
          : addGravatarSupport(sideBarInfo);
        callback(null, authorAvatar);
      } else {
        callback(fastify.statusCode.NOT_FOUND).send(err);
      }
    },
  });
}
export default sidebarRoute;
