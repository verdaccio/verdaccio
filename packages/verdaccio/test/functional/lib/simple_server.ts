import fastify, { FastifyInstance } from 'fastify';

/**
 * Simple Server
 *
 * A empty express server with the objective to emumate any external API.
 *
 * eg: test/functional/tags/tags.ts
 *
 *  express.get('/testexp_tags', function(req, res) {
        let f = readTags().toString().replace(/__NAME__/g, 'testexp_tags');
        res.send(JSON.parse(f));
    });
 *
 * or at test/functional/package/gzip.ts
 */
export default class SimpleServer {
  public server: FastifyInstance;

  public constructor() {
    this.server = fastify({ logger: true });
  }

  public async start(port: number = 55550): Promise<void> {
    await this.server.listen(port);
    // prevent keeping the process running.
    this.server.server.unref();
  }
}
