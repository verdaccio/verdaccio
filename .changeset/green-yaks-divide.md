---
'@verdaccio/api': minor
'@verdaccio/cli': minor
'@verdaccio/core': minor
'@verdaccio/node-api': minor
'@verdaccio/server': minor
'@verdaccio/server-fastify': minor
'verdaccio': minor
---

chore: env variable for launch fastify

- Update fastify to major release `v4.3.0`
- Update CLI launcher

via CLI

```
VERDACCIO_SERVER=fastify verdaccio
```

with docker

```
docker run -it --rm --name verdaccio \
  -e "VERDACCIO_SERVER=8080" -p 8080:8080 \
  -e "VERDACCIO_SERVER=fastify" \
  verdaccio/verdaccio
```
