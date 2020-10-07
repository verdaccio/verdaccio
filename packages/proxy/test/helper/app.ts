// import fs from 'fs';
// import util from 'util';
import express from 'express';

const app = express();
// const streamPipeline = util.promisify(require('stream').pipeline);

export function prepareApp(callback) {
  app.get('/fetch', callback);
  return app;
}
