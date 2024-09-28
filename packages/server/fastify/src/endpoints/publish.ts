// import buildDebug from 'debug';
// import { FastifyInstance } from 'fastify';

// import { Package, Version } from '@verdaccio/types';

// const debug = buildDebug('verdaccio:web:api:sidebar');
// export type $SidebarPackage = Package & { latest: Version };

// async function manifestRoute(fastify: FastifyInstance) {
//   // TODO: review // :_rev?/:revision?
//   fastify.put('/:packageName', async (request) => {
//     // @ts-ignore
//     const { packageName } = request.params;
//     const storage = fastify.storage;
//     debug('pkg name %s ', packageName);
//     // const data = await storage?.getPackage({
//     //   name: packageName,
//     //   req: request.raw,
//     //   uplinksLook: true,
//     //   requestOptions: {
//     //     protocol: request.protocol,
//     //     headers: request.headers as any,
//     //     host: request.hostname,
//     //   },
//     // });
//     // return data;
//   });
// }

// export default manifestRoute;
