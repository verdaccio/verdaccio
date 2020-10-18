import express from 'express';

const app = express();

export function prepareApp(callback) {
  app.get('/tarball', callback);
  return app;
}
