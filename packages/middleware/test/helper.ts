import express from 'express';

export const getApp = (middlewares = []) => {
  const app = express();
  middlewares.map((middleware) => {
    app.use(middleware);
  });

  // app.get('/', function (req, res) {
  //   res.status(200).json({ name: 'pkg' });
  // });

  return app;
};
