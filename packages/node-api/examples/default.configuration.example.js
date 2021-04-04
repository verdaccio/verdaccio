const { runServer } = require('../build');

(async () => {
  const app = await runServer();
  app.listen(4000, () => {
    console.log('server started');
  });
})();
