---
'@verdaccio/api': minor
'@verdaccio/types': minor
'@verdaccio/local-storage': minor
'@verdaccio/server-fastify': minor
'@verdaccio/store': minor
'@verdaccio/test-helper': minor
'@verdaccio/web': minor
---

feat: implement abbreviated manifest

Enable abbreviated manifest data by adding the header:

```
curl -H "Accept: application/vnd.npm.install-v1+json" https://registry.npmjs.org/verdaccio
```

It returns a filtered manifest, additionally includes the [time](https://github.com/pnpm/rfcs/pull/2) field by request.

Current support for packages managers:

- npm: yes
- pnpm: yes
- yarn classic: yes
- yarn modern (+2.x): [no](https://github.com/yarnpkg/berry/pull/3981#issuecomment-1076566096)

https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format
