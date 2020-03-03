import express from 'express';
import bodyParser from 'body-parser';

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
export default class ExpressServer {
  private app: any;
  private server: any;

  public constructor() {
    this.app = express();
  }

  public start(port: number): Promise<ExpressServer> {
    return new Promise((resolve) => {
      this.app.use(bodyParser.json());
      this.app.use(
        bodyParser.urlencoded({
          extended: true
        })
      );

      this.server = this.app.listen(port, () => resolve(this));
    });
  }
}
