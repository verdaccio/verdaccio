import express from 'express';
import bodyParser from 'body-parser';

export default class ExpressServer {
  app: any;
  server: any;

  constructor() {
    this.app = express();
  }

  start(port: number): Promise<any> {
    return new Promise((resolve) => {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({
        extended: true
      }));

      this.server = this.app.listen(port, () => {
        resolve(this);
      });
    });
  }
}
