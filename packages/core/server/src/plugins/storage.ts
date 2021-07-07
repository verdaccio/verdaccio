import { Storage } from '@verdaccio/store';

export async function storageService(fastify, opts, done) {
  const { config, filters } = opts;
  // @ts-ignore
  const storage: Storage = new Storage(config);
  await storage.init(config, filters ?? {});
  fastify.decorate('storage', storage);
  done();
}
