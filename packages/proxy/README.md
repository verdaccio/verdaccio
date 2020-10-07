# @verdaccio/proxy

Library that handle proxy request to remote registries

## API

```
import Proxy from '@verdaccio/proxy';


const proxy = new Proxy(options);
```

### Fetch tarball

```
const stream = await proxy.fetchTarball(fileNames);
```

### Fetch metadata

```
const stream = await proxy.getRemoteMetadata('package-name', options);
```
