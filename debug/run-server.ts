import { setup } from '@verdaccio/logger';

const { runServer } = require('../src');

(async () => {
  setup({});
  const app = await runServer(); // default configuration
  app.listen(4000, () => {
    console.log('listening on port 4000');
  });
})();
