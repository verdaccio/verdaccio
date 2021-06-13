import { Storage, IStorageHandler } from '@verdaccio/store';

export async function storageService(fastify, opts, done) {
  const { config, filters } = opts;
  const storage: IStorageHandler = new Storage(config);
  await storage.init(config, filters ?? {});
  fastify.decorate('storage', storage);
  done();
}
