---
'@verdaccio/api': major
'@verdaccio/cli': major
'@verdaccio/config': major
'@verdaccio/core': major
'@verdaccio/types': major
'@verdaccio/logger': major
'@verdaccio/node-api': major
'verdaccio-aws-s3-storage': major
'verdaccio-google-cloud': major
'verdaccio-htpasswd': major
'@verdaccio/local-storage': major
'verdaccio-memory': major
'@verdaccio/ui-theme': major
'@verdaccio/proxy': major
'@verdaccio/server': major
'verdaccio': major
'@verdaccio/web': major
---

feat!: config.logs throw an error, logging config not longer accept array or logs property

### 💥 Breaking change

This is valid

```yaml
log: { type: stdout, format: pretty, level: http }
```

This is invalid

```yaml
logs: { type: stdout, format: pretty, level: http }
```

or

```yaml
logs:
  - [{ type: stdout, format: pretty, level: http }]
```
