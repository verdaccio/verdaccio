---
'@verdaccio/api': major
'@verdaccio/server-fastify': major
'@verdaccio/tarball': major
'@verdaccio/local-storage': major
'verdaccio-memory': major
'@verdaccio/server': major
'@verdaccio/store': major
'@verdaccio/utils': major
---

refactor: download manifest endpoint and integrate fastify

Much simpler API for fetching a package

```
 const manifest = await storage.getPackageNext({
      name,
      uplinksLook: true,
      req,
      version: queryVersion,
      requestOptions,
 });
```

> not perfect, the `req` still is being passed to the proxy (this has to be refactored at proxy package) and then removed from here, in proxy we pass the request instance to the `request` library.

### Details

- `async/await` sugar for getPackage()
- Improve and reuse code between current implementation and new fastify endpoint (add scaffolding for request manifest)
- Improve performance
- Add new tests

### Breaking changes

All storage plugins will stop to work since the storage uses `getPackageNext` method which is Promise based, I won't replace this now because will force me to update all plugins, I'll follow up in another PR. Currently will throw http 500
