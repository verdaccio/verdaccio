---
'@verdaccio/cli': major
'@verdaccio/config': major
'@verdaccio/types': major
'@verdaccio/logger': major
'@verdaccio/node-api': major
'verdaccio-google-cloud': major
'verdaccio': major
---

feat: node api new structure based on promise

```js
import { runServer } from '@verdaccio/node-api';
// or
import { runServer } from 'verdaccio';

const app = await runServer(); // default configuration
const app = await runServer('./config/config.yaml');
const app = await runServer({ configuration });
app.listen(4000, (event) => {
  // do something
});
```

### Breaking Change

If you are using the node-api, the new structure is Promise based and less arguments.
